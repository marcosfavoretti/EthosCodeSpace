import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import { ProcessaTipoMarcacaoUseCase } from '@app/modules/modules/relogio-de-ponto/application/ProcessaTipoMarcacao.usecase';
import { Controller, Inject, Logger, ParseArrayPipe } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@Controller()
export class WorkerController {

  @Inject(ProcessaTipoMarcacaoUseCase)
  private processaTipoMarcacaoUseCase: ProcessaTipoMarcacaoUseCase;

  @EventPattern('ponto.processar')
  async processData(
    @Payload(new ParseArrayPipe({ items: ResPontoRegistroDTO }))
    data: ResPontoRegistroDTO[],
    @Ctx()
    context: RmqContext,
  ): Promise<void> {
    try {
      const channel = context.getChannelRef() as Channel;
      const originalMsg = context.getMessage() as Message;

      if (!channel || !originalMsg) {
        Logger.error('Channel or message is missing');
        return;
      }
      await this.processaTipoMarcacaoUseCase.processa(data);
    } catch (e: any) {
      Logger.error(`Erro processando mensagem.`, e);
      throw e;
    }
  }
}
