import { Injectable, Logger } from '@nestjs/common';
import { INotificaFalhas } from '../../@core/interfaces/INotificaFalhas';
import { EmailHttpClient } from '@app/modules/contracts/clients/EmailHttp.client';
import { ConfigService } from '@nestjs/config';
import { EmailHtml } from '@app/modules/modules/notificacao/@core/classes/EmailHtml';

@Injectable()
export class PlanejadorNotificaPorEmailService implements INotificaFalhas {
  constructor(
    configService: ConfigService,
    private readonly emailClient: EmailHttpClient,
  ) {}

  async notificarFalha<T extends Error>(props: {
    to: string[];
    subject: string;
    message: string;
    errors?: T[];
  }): Promise<void> {
    try {
      // Implementação do envio de email
      const email = EmailHtml.fromConfigObject({
        html: props.message,
        from: 'planejador@ethos.ind.br',
        subject: props.subject,
        to: props.to,
      });
      await this.emailClient.sendEmail(email);
    } catch (error) {
      Logger.error(error);
      throw new Error(`Erro ao enviar email: ${error.message}`);
    }
  }
}
