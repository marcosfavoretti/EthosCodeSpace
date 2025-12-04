import { Inject, Logger } from '@nestjs/common';
import { ConsutlarItensAtivosService } from '../infra/service/ConsultarItensAtivos.service';
import { GerenciaBuffersService } from '../infra/service/GerenciaBuffers.service';
import { ConsultaMercadoService } from '../infra/service/ConsultarMercado.service';
import { CONSULTA } from '../@core/enum/CONSULTA.enum';
import { BufferHistoricoBuilder } from '../@core/builder/BufferHistorico.builder';
import { BufferHistorico } from '../@core/entities/BufferHistorico.entity';
import { ItemXQtdSemana } from '../../@syneco/@core/entities/ItemXQtdSemana.entity';
import { ItemXQtdSemanaComBuffer } from '../@core/entities/ItemQtdSemana.entity';

const jobName = 'Iniciando novo dia de produção';

export class JobCriacaoTabelaUseCase {
  private readonly logger = new Logger(JobCriacaoTabelaUseCase.name);

  constructor(
    @Inject(ConsutlarItensAtivosService)
    private consultaService: ConsutlarItensAtivosService,
    @Inject(ConsultaMercadoService)
    private consultaMercadoService: ConsultaMercadoService,
    @Inject(GerenciaBuffersService)
    private gerenciaBufferService: GerenciaBuffersService,
  ) {}

  async job(): Promise<void> {
    this.logger.log(`Iniciando ${jobName}`, 'CRON JOB');

    try {
      const mercadosDisponiveis =
        await this.consultaMercadoService.consultarMercadosExistentes();
      const todosItensParaSalvar: BufferHistorico[] = [];

      for (const mercado of mercadosDisponiveis) {
        try {
          let itens: ItemXQtdSemanaComBuffer[] = [];

          if (mercado.consulta === CONSULTA._000) {
            itens = await this.consultaService.itensAtivos000();
          } else if (mercado.consulta === CONSULTA._110) {
            itens = await this.consultaService.itensAtivos110();
          } else {
            this.logger.warn(
              `Tipo de consulta desconhecido para o mercado ${mercado.nome}: ${mercado.consulta}`,
            );
            continue;
          }
          const itensDoMercadoParaSalvar = itens.map((i) => {
            return new BufferHistoricoBuilder()
              .capturaData()
              .comItem(i)
              .noMercado(mercado)
              .comQtdBuffer(0)
              .build();
          });
          todosItensParaSalvar.push(...itensDoMercadoParaSalvar);
          this.logger.debug(
            `Processado ${itensDoMercadoParaSalvar.length} itens para o mercado: ${mercado.nome}`,
          );
        } catch (errorMercado) {
          this.logger.error(
            `Erro ao processar mercado ${mercado.nome}: ${errorMercado.message}`,
            errorMercado.stack,
          );
        }
      }

      if (todosItensParaSalvar.length > 0) {
        await this.gerenciaBufferService.salva(...todosItensParaSalvar);
        this.logger.log(
          `Salvos ${todosItensParaSalvar.length} registros de BufferHistorico.`,
        );
      } else {
        this.logger.warn(
          'Nenhum item encontrado para salvar após processar todos os mercados.',
        );
      }
    } catch (mainError) {
      this.logger.error(
        `Falha crítica no job ${jobName}: ${mainError.message}`,
        mainError.stack,
      );
      throw mainError;
    } finally {
      this.logger.log(`Finalizado ${jobName}`);
    }
  }
}
