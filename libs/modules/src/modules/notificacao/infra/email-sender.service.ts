import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import Mail, { Attachment } from 'nodemailer/lib/mailer';
import { ISendMessagesGeneric } from '../@core/interfaces/ISendMessageGeneric.abstract';
import { Email } from '../@core/classes/Email';

@Injectable()
export class EmailSenderService implements ISendMessagesGeneric<Email> {
  constructor(
    @Inject('NODEMAILER_TRANSPORTER') private emailConnection: Mail,
  ) {}
  async send(message_pattern: Email): Promise<void> {
    await this.emailConnection.sendMail(message_pattern).catch((err) => {
      Logger.error(err);
      throw new HttpException(
        'Não foi possivel enviar o email',
        HttpStatus.BAD_REQUEST,
      );
    });
  }
}
