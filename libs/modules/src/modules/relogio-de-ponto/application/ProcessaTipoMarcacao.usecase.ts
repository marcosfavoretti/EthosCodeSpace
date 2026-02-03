import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import { Inject, Logger } from '@nestjs/common';
import { ComputaMarcacaoService } from '../infra/services/ComputaMarcacao.service';
import { Between, DataSource, In, Repository } from 'typeorm';
import { TipoMarcacaoPonto } from '../@core/entities/TipoMarcacaoPonto.entity';
import { differenceInHours, subHours } from 'date-fns';
import { RpcException } from '@nestjs/microservices';
import { RegistroPonto } from '../@core/entities/RegistroPonto.entity'; // Import the entity
import { RegistroPontoRepository } from '../infra/repository/RegistroPonto.repository'; // Import the custom repository
import { TipoMarcacaoPontoRepository } from '../infra/repository/TipoMarcacaoPonto.repository'; // Import the custom repository
import { InjectDataSource } from '@nestjs/typeorm';

export class ProcessaTipoMarcacaoUseCase {
  // Define um limite de horas para considerar que um turno acabou.
  // Se a última batida foi há mais de 8h, assumimos que é um novo dia.
  private readonly MAX_SHIFT_GAP_HOURS = 9;

  constructor(
    @Inject(RegistroPontoRepository) // Still inject for potential usage outside transaction
    private registroPontoRepository: RegistroPontoRepository,

    @Inject(ComputaMarcacaoService)
    private computaMarcacaoService: ComputaMarcacaoService,

    @Inject(TipoMarcacaoPontoRepository) // Still inject for potential usage outside transaction
    private tipoMarcacaoPontoRepository: TipoMarcacaoPontoRepository,

    @InjectDataSource('logix')
    private dataSource: DataSource,
  ) {}

  async processa(dto: ResPontoRegistroDTO[]): Promise<TipoMarcacaoPonto[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (dto.length === 0) {
        await queryRunner.rollbackTransaction();
        return [];
      }

      // Use queryRunner.manager.getRepository for all operations within the transaction
      const tipoMarcacaoRepo = queryRunner.manager.getRepository(TipoMarcacaoPonto);
      const registroPontoEntityRepo = queryRunner.manager.getRepository(RegistroPonto);

      const ids = dto.map((d) => d.id);

      // Verificação de duplicidade antes de processar
      const exists = await tipoMarcacaoRepo.exist({
        where: { registroPonto: { id: In(ids) } },
      });

      if (exists) {
        Logger.warn(
          'Registros já processados detectados. Abortando para evitar duplicidade.',
        );
        await queryRunner.rollbackTransaction();
        return [];
      }

      // Ordena cronologicamente
      const dtoOrdenada = dto.sort(
        (a, b) => a.dataHoraAr.getTime() - b.dataHoraAr.getTime(),
      );

      const dadosProcessados: TipoMarcacaoPonto[] = [];

      /**
       * Loop de processamento
       */
      for (const pontoDto of dtoOrdenada) {
        const registroPonto = await registroPontoEntityRepo.findOne({
          where: { id: pontoDto.id }
        });

        if (!registroPonto) {
          Logger.error(
            `Registro de ponto ${pontoDto.id} não encontrado no banco.`,
          );
          continue;
        }

        // 1. Busca histórico no Banco com LOCK PESSIMISTA
        // Removido 'take: 5' para evitar erro ORA-00907 com FOR UPDATE no Oracle.
        // Usamos Between para limitar o range e trazer apenas dados relevantes.
        const contextoBanco = await tipoMarcacaoRepo.find({
          where: {
            registroPonto: {
              mat: pontoDto.mat,
              dataHoraAr: Between(subHours(new Date(), 48), pontoDto.dataHoraAr),
            },
          },
          order: { registroPonto: { dataHoraAr: 'DESC' } },
          lock: { mode: 'pessimistic_write' }
        });

        // 2. Prepara histórico local (processados nesta execução)
        // CORREÇÃO: Filtrar apenas os registros do MESMO colaborador para evitar contaminação de contexto
        const contextoLocalDesc = dadosProcessados
          .filter((d) => d.registroPonto.mat === pontoDto.mat)
          .reverse();

        // 3. Unifica os contextos
        const contextoCompleto = [...contextoLocalDesc, ...contextoBanco];

        // 4. CORREÇÃO DO BUG DE LÓGICA (Time Gap)
        let contextoValidoParaServico: TipoMarcacaoPonto[] = [];

        if (contextoCompleto.length > 0) {
          const ultimaBatida = contextoCompleto[0].registroPonto.dataHoraAr;
          const horasDiferenca = differenceInHours(
            pontoDto.dataHoraAr,
            ultimaBatida,
          );

          if (horasDiferenca < this.MAX_SHIFT_GAP_HOURS) {
            const indice1E = contextoCompleto.findIndex(
              (c) => c.marcacao === '1E',
            );

            if (indice1E !== -1) {
              contextoValidoParaServico = contextoCompleto.slice(
                0,
                indice1E + 1,
              );
            } else {
              contextoValidoParaServico = contextoCompleto;
            }
          } else {
            Logger.debug(
              `Gap de ${horasDiferenca}h detectado. Iniciando novo contexto de turno.`,
            );
            contextoValidoParaServico = [];
          }
        }

        // 5. Processa (Lógica de Domínio)
        const resultado = await this.computaMarcacaoService.processar({
          pontos: registroPonto,
          contextoMarcacao: contextoValidoParaServico,
        });

        const resultadoArray = Array.isArray(resultado)
          ? resultado
          : [resultado];

        dadosProcessados.push(...(resultadoArray as TipoMarcacaoPonto[]));
      }

      // Salva tudo de uma vez no final, ainda dentro da transação
      if (dadosProcessados.length > 0) {
        await tipoMarcacaoRepo.save(dadosProcessados);
      }

      await queryRunner.commitTransaction();
      return dadosProcessados;

    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Tratamento de erro específico para Banco de Dados
      // Se for timeout ou erro de conexão, lança RpcException para o RabbitMQ tentar de novo (NACK/Requeue)
      if (
        (error instanceof Error && error.message?.includes('NJS-040')) || // Connection timeout
        (error instanceof Error && error.message?.includes('NJS-076')) || // Connection rejected
        (error instanceof Error && error.message?.includes('ORA-'))        // Erros gerais do Oracle
      ) {
        Logger.error(`Erro de banco detectado: ${error.message}. Solicitando Requeue.`);
        throw new RpcException(error.message); // Pass error message to RpcException
      }

      Logger.error(`Erro fatal ao processar marcacao: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}