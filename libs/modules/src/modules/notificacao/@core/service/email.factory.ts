import { SendEmailDTO } from '@app/modules/contracts/dto/SendEmail.dto';
import { Injectable } from '@nestjs/common';
import { Email } from '../classes/Email';
import { EmailHtml } from '../classes/EmailHtml';
import { EmailText } from '../classes/Emailtext';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailFactory {
  private from: string;
  constructor(private configService: ConfigService) {
    this.from = this.configService.get<string>('MAIL_FROM')!;
  }
  build(param: SendEmailDTO): Email {
    return param.html
      ? new EmailHtml(param.to, this.from, param.subject, param.html)
      : new EmailText(param.to, this.from, param.subject, param.text!);
  }
}
