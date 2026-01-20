import { Logger } from '@nestjs/common';
import { INotificaFalhas } from '../../@core/interfaces/INotificaFalhas';

export class PlanejadorNotificaLoggerService implements INotificaFalhas {
  async notificarFalha<T extends Error>(props: {
    to: string[];
    subject: string;
    message: string;
    errors?: T[];
  }): Promise<void> {
    Logger.debug(`começo do email de ${new Date().toString()}`);
    console.log('Simulando envio de email para:', props.to);
    console.log('Assunto:', props.subject);
    console.log('Mensagem:', props.message);
    if (props.errors) {
      console.log('Erros adicionais:', props.errors);
    }
    Logger.debug('fim do email');
  }
}
