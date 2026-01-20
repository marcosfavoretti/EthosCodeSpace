import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import { Inject, Logger } from '@nestjs/common';
import { TipoMarcacaoPontoRepository } from '../infra/repository/TipoMarcacaoPonto.repository';
import { ComputaMarcacaoService } from '../infra/services/ComputaMarcacao.service';
import { In, LessThan } from 'typeorm';
import { RegistroPontoRepository } from '../infra/repository/RegistroPonto.repository';
import { TipoMarcacaoPonto } from '../@core/entities/TipoMarcacaoPonto.entity';
import { differenceInHours } from 'date-fns'; // Recomendado usar date-fns

export class ProcessaTipoMarcacaoUseCase {
  // Define um limite de horas para considerar que um turno acabou.
  // Se a última batida foi há mais de 8h, assumimos que é um novo dia.
  private readonly MAX_SHIFT_GAP_HOURS = 9;

  constructor(
    @Inject(RegistroPontoRepository)
    private registroPontoRepository: RegistroPontoRepository,

    @Inject(ComputaMarcacaoService)
    private computaMarcacaoService: ComputaMarcacaoService,

    @Inject(TipoMarcacaoPontoRepository)
    private tipoMarcacaoPontoRepository: TipoMarcacaoPontoRepository,
  ) {}

  async processa(dto: ResPontoRegistroDTO[]): Promise<TipoMarcacaoPonto[]> {
    try {
      if (dto.length === 0) return [];

      // 0. Performance: Buscar todos os registros de ponto do DTO de uma vez (Evita N+1)
      const ids = dto.map((d) => d.id);

      const exists = await this.tipoMarcacaoPontoRepository.exists({
        where: { registroPonto: { id: In(ids) } },
      });

      if (exists) {
        Logger.warn(
          'Registros já processados detectados. Abortando para evitar duplicidade.',
        );
        return [];
      }

      const registrosMap = await this.preloadRegistros(ids);

      // Ordena cronologicamente
      const dtoOrdenada = dto.sort(
        (a, b) => a.dataHoraAr.getTime() - b.dataHoraAr.getTime(),
      );

      const dadosProcessados: TipoMarcacaoPonto[] = [];

      /**
       * Loop de processamento
       */
      for (const pontoDto of dtoOrdenada) {
        const registroPonto = registrosMap.get(pontoDto.id);
        if (!registroPonto) {
          Logger.error(
            `Registro de ponto ${pontoDto.id} não encontrado no banco.`,
          );
          continue;
        }

        // 1. Busca histórico no Banco (Do mais novo para o mais antigo)
        const contextoBanco = await this.tipoMarcacaoPontoRepository.find({
          where: {
            registroPonto: {
              mat: pontoDto.mat,
              dataHoraAr: LessThan(pontoDto.dataHoraAr),
            },
          },
          order: { registroPonto: { dataHoraAr: 'DESC' } },
          take: 5, // Reduzi para 5, geralmente suficiente para achar o último par
        });

        // 2. Prepara histórico local (processados nesta execução)
        // Invertemos para ficar DESC (Do mais novo para o mais antigo) igual ao banco
        const contextoLocalDesc = [...dadosProcessados].reverse();

        // 3. Unifica os contextos (Prioridade: Local > Banco)
        const contextoCompleto = [...contextoLocalDesc, ...contextoBanco];

        // 4. CORREÇÃO DO BUG DE LÓGICA (Time Gap)
        // Antes de procurar o '1E', verificamos: "A última batida foi há muito tempo?"
        // Se a última batida registrada foi há 20 horas, não importa se foi um '1E' ou '2E',
        // o turno atual NÃO deve continuar aquela sequência. Devemos enviar um contexto vazio
        // para forçar o serviço a iniciar um novo ciclo (1E).

        let contextoValidoParaServico: TipoMarcacaoPonto[] = [];

        if (contextoCompleto.length > 0) {
          const ultimaBatida = contextoCompleto[0].registroPonto.dataHoraAr;
          const horasDiferenca = differenceInHours(
            pontoDto.dataHoraAr,
            ultimaBatida,
          );

          if (horasDiferenca < this.MAX_SHIFT_GAP_HOURS) {
            // Se está dentro da janela de turno, aplicamos a lógica de buscar o '1E'
            const indice1E = contextoCompleto.findIndex(
              (c) => c.marcacao === '1E',
            );

            if (indice1E !== -1) {
              // Pega tudo até o último 1E encontrado
              contextoValidoParaServico = contextoCompleto.slice(
                0,
                indice1E + 1,
              );
            } else {
              // Se não achou 1E, manda o que tem (dentro do limite de tempo)
              contextoValidoParaServico = contextoCompleto;
            }
          } else {
            Logger.debug(
              `Gap de ${horasDiferenca}h detectado. Iniciando novo contexto de turno.`,
            );
            // Contexto vazio = Serviço vai entender como início de jornada (1E)
            contextoValidoParaServico = [];
          }
        }

        // 5. Processa
        // O cast 'as TipoMarcacaoPonto[]' sugere que o serviço retorna array, mas processamos 1 ponto por vez aqui.
        // Ajuste conforme seu serviço. Assumindo que retorna o objeto processado.
        const resultado = await this.computaMarcacaoService.processar({
          pontos: registroPonto,
          contextoMarcacao: contextoValidoParaServico,
        });

        // Se o serviço retorna array, pegamos o item (ou spread).
        // Se o serviço retorna objeto único, ajuste aqui.
        const resultadoArray = Array.isArray(resultado)
          ? resultado
          : [resultado];

        dadosProcessados.push(...(resultadoArray as TipoMarcacaoPonto[]));
      }

      // Salva tudo de uma vez no final
      if (dadosProcessados.length > 0) {
        await this.tipoMarcacaoPontoRepository.save(dadosProcessados);
      }

      return dadosProcessados;
    } catch (error) {
      Logger.error(`Erro ao processar marcacao: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Helper para evitar query dentro do loop
  private async preloadRegistros(ids: number[]) {
    const registros = await this.registroPontoRepository.find({
      where: { id: In(ids) },
    });
    return new Map(registros.map((r) => [r.id, r]));
  }
}
