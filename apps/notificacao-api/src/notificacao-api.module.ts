import { Module } from '@nestjs/common';
import { NotificacaoApiEmailController } from './delivery/notificacao-api-email.controller';
import { ConfigModule } from '@nestjs/config';
import { NotificacaoModule } from '@app/modules/modules/notificacao/Notificacao.module';
import { validate } from './config/env.validation';

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
