import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import { Inject, Logger } from '@nestjs/common';
import { TipoMarcacaoPontoRepository } from '../infra/repository/TipoMarcacaoPonto.repository';
import { ComputaMarcacaoService } from '../infra/services/ComputaMarcacao.service';
import { In, LessThan } from 'typeorm';
import { RegistroPontoRepository } from '../infra/repository/RegistroPonto.repository';
import { TipoMarcacaoPonto } from '../@core/entities/TipoMarcacaoPonto.entity';

export class ProcessaTipoMarcacaoUseCase {
  constructor(
    @Inject(RegistroPontoRepository)
    private registroPontoRepository: RegistroPontoRepository,

    @Inject(ComputaMarcacaoService)
    private computaMarcacaoService: ComputaMarcacaoService,

    @Inject(TipoMarcacaoPontoRepository)
    private tipoMarcacaoPontoRepository: TipoMarcacaoPontoRepository,
  ) { }


  async processa(dto: ResPontoRegistroDTO[]): Promise<any> {
    try {
      // Ordena todos os pontos do DTO por data e hora crescente (ASC)
      const dtoOrdenada = dto.sort((a, b) =>
        a.dataHoraAr.getTime() - b.dataHoraAr.getTime(),
      );
      
      // Array para armazenar as novas marcações processadas nesta rodada (ASC)
      const dadosProcessados: TipoMarcacaoPonto[] = [];

      /**
       * Valida se já tem tipo de marcacao atribuido
       */
      const exists = await this.tipoMarcacaoPontoRepository.exists({
        where: {
          registroPonto: {
            id: In(dto.map((ponto) => ponto.id)),
          },
        }
      });

      if (exists) {
        Logger.warn('Registro duplicado detectado para os IDs do DTO.');
        return;
      }
      
      /**
       * Loop de processamento de cada ponto
       */
      for (const ponto of dtoOrdenada) {
        
        // 1. Busca contexto histórico (do mais novo para o mais antigo, DESC)
        // Usamos take: 10, assumindo que '1E' estará neste limite
        const contextoBanco = await this.tipoMarcacaoPontoRepository
          .find(
            {
              where: {
                registroPonto: {
                  mat: ponto.mat,
                  dataHoraAr: LessThan(ponto.dataHoraAr)
                }
              },
              order: {
                registroPonto: {
                  dataHoraAr: 'DESC'
                }
              },
              take: 10
            }
          );
          
        // 2. Cria contexto histórico do turno (do mais novo até o '1E' no DB)
        const indice1EHistorico = contextoBanco.findIndex((contexto) => contexto.marcacao === '1E');
        
        // Contexto histórico do turno (DESC)
        const contextoHistoricoDoTurno: TipoMarcacaoPonto[] = (indice1EHistorico === -1) 
            ? contextoBanco // Se '1E' não foi achado, usa o máximo de histórico
            : contextoBanco.slice(0, indice1EHistorico + 1); // Pega até (e incluindo) o '1E'
        
        
        // 3. Prepara contexto da rodada atual (para resolver o bug de Race Condition)
        // O serviço (ComputaMarcacaoService) espera o contexto em ordem DESC (do mais novo ao mais antigo)
        // dadosProcessados está em ordem ASC, então precisamos inverter a ordem.
        const contextoDaRodadaAtual = [...dadosProcessados].reverse();
        
        // 4. Combina os contextos: Novo (da rodada atual) + Histórico (do DB)
        // O array final está em ordem DESC: [1S 12:30, 1E 7:30, 2S 19/10, ...]
        const contextoCompleto = [...contextoDaRodadaAtual, ...contextoHistoricoDoTurno];

        // 5. Encontra o '1E' no array completo (a marcação mais recente de início de período)
        const inicioAlvoCompleto = contextoCompleto.findIndex((contexto) => contexto.marcacao === '1E');

        // 6. Define o contexto final que será enviado ao serviço (até o '1E' mais novo)
        const contextoFinalParaServico = contextoCompleto.slice(0, inicioAlvoCompleto + 1);

        Logger.debug(contextoFinalParaServico, `Contexto Marcacao para Ponto ${ponto.id}`);
        
        const registro = await this.registroPontoRepository
          .findOneOrFail(
            {
              where: {
                id: ponto.id
              },
            }
          );

        /**
         * Joga para estrategia de processamento de marcacao
         */
        const registrosProcessados: TipoMarcacaoPonto[] = await this.computaMarcacaoService
          .processar({
            pontos: registro,
            contextoMarcacao: contextoFinalParaServico, // Passa o contexto corrigido
          }) as TipoMarcacaoPonto[];

        // Adiciona as novas marcações ao array (em ordem ASC) para que sirvam
        // de contexto para os próximos pontos do DTO.
        dadosProcessados.push(...registrosProcessados);
      }

      /**
       * Salva os valores de marcacao
      */
      await this.tipoMarcacaoPontoRepository
        .save(dadosProcessados);

      /**
     * Retorno os valores de maracacao processados
     */
      return dadosProcessados;
    } catch (error) {
      Logger.error(error.message, error.stack, 'ProcessaTipoMarcacaoUseCase');
      throw error;
    }
  }
}