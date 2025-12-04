import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ethos-relogio-de-ponto/.env',
      validationSchema,
    }),
  ],
})
export class ConfigModuleShared {}
