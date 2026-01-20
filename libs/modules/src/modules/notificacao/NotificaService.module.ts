import { Module } from '@nestjs/common';
import { NodemailerProviderModule } from './NodemailerProvider.module';
import { ISendMessagesGeneric } from './@core/interfaces/ISendMessageGeneric.abstract';
import { EmailSenderService } from './infra/email-sender.service';
import { EmailFactory } from './@core/service/email.factory';

@Module({
  imports: [NodemailerProviderModule],
  providers: [
    {
      provide: ISendMessagesGeneric,
      useClass: EmailSenderService,
    },
    EmailFactory,
  ],
  exports: [EmailFactory, ISendMessagesGeneric, NodemailerProviderModule],
})
export class NotificaServiceModule {}
