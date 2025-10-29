import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EstruturaController } from './delivery/Estrutura.controller';
import { EstruturaModule } from '@app/modules/modules/estrutura/Estrutura.module';
import { EstruturaServiceModule } from '@app/modules/modules/estrutura/EstruturaService.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/estrutura-api/.env',
    }),
    EstruturaServiceModule,
    EstruturaModule,
  ],
  controllers: [EstruturaController],
  providers: [],

})
export class EstruturaApiModule { }
