import { SincronizaPontosUseCase } from '@app/modules/modules/relogio-de-ponto/application/SincronizaPontos.usecase';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'; // 1. Importe OnModuleInit
import { PROCESSA_WORKER } from '../@core/symbols/symbols';
import { ClientProxy } from '@nestjs/microservices';
import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class SincronizacaoPollingService implements OnModuleInit { // 2. Implemente a interface
  constructor(
    @Inject(SincronizaPontosUseCase)
    private sincronizacaoUseCase: SincronizaPontosUseCase,
    @Inject(PROCESSA_WORKER)
    private client: ClientProxy,
  ) { }
  teste = true
  // 3. Force a conexão assim que o módulo iniciar
  async onModuleInit() {
    try {
      await this.client.connect();
      Logger.log('Conectado ao RabbitMQ com sucesso!', 'SincronizacaoPollingService');
    }
    catch (error) {
      Logger.error('Falha fatal ao conectar no RabbitMQ na inicialização', error);
    }
  }

  @Interval(10_000 * 12)
  async sincronizarPontos() {
    try {
      Logger.warn('POLLING INICIADO');
      const pontosSincronizados = await this.sincronizacaoUseCase.sincronizarPontos();

      if (!pontosSincronizados || pontosSincronizados.length === 0) {
        Logger.warn('Nenhum ponto novo foi sincronizado. Nada para enviar.');
        return;
      }
      
      // (Lógica de agrupamento mantida...)
      const pontosPorUsuarioMap = new Map<string, ResPontoRegistroDTO[]>();

      pontosSincronizados.forEach((ponto) => {
        if (!pontosPorUsuarioMap.has(ponto.mat)) {
          pontosPorUsuarioMap.set(ponto.mat, []);
        }
        const currentList = pontosPorUsuarioMap.get(ponto.mat);
        pontosPorUsuarioMap.set(ponto.mat, [...currentList!, ponto]);
      });

      if (pontosPorUsuarioMap.size === 0) {
        Logger.warn('Mapa de pontos por usuário está vazio. Nenhum evento para emitir.');
        return;
      }

      pontosPorUsuarioMap.forEach((value, key) => {
        Logger.warn(`pontos da matricula ${key} enviados para processamento`);

        // 4. Tratamento correto do envio
        this.client.emit('ponto.processar', value)
          .subscribe({
            next: () => {
              // O 'next' no emit geralmente é vazio, mas confirma que foi despachado para o broker
              Logger.debug(`Lote ${key} despachado para a fila`);
            },
            error: (err) => {
              // 5. AQUI você garante que sabe se a conexão caiu ou falhou
              Logger.error(`ERRO ao enviar matricula ${key} para fila: ${err.message}`);
              // Opcional: Salvar em um banco para retentativa (Dead Letter local)
            },
          });
      });

      Logger.warn('POLLING FINALIZADO');
    } catch (error) {
      console.error(error);
      Logger.error('falha ao sincronizar pontos');
    }
  }
}