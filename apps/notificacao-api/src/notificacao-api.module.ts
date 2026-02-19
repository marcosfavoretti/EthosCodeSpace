import { Module } from '@nestjs/common';
import { NotificacaoApiEmailController } from './delivery/notificacao-api-email.controller';
import { ConfigModule } from '@nestjs/config';
import { NotificacaoModule } from '@app/modules/modules/notificacao/Notificacao.module';
import { validate } from './config/env.validation';
import { ApiExtraModels } from '@nestjs/swagger'; // Added import
import { AttachmentDto } from '@app/modules/contracts/dto/Attachment.dto'; // Added import

@ApiExtraModels(AttachmentDto) // Added decorator
@Module({
  imports: [
    NotificacaoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/notificacao-api/.env',
      validate,
    }),
  ],
  controllers: [NotificacaoApiEmailController],
  providers: [],
})
export class NotificacaoApiModule {}
