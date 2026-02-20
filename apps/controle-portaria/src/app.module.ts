import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControleVeiculosModule } from '@app/modules/modules/controleVeiculos/controle-veiculos.module';
import { Veiculo } from '@app/modules/modules/controleVeiculos/@core/entity/Veiculo.entity';
import { ControleVeiculosWebHookController } from './delivery/controle-veiculos-webhook.controller';
import { typeormMongoConfig } from '@app/modules/config/TypeormMongoConfig.module';
import { validate } from './config/env.validation'; // Import the validate function
import { StorageModule } from '@app/modules/modules/storage/Storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/controle-portaria/.env',
      validate: validate, // Pass the validate function directly
    }),
    StorageModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'mongo',
      useFactory: (configService: ConfigService) => typeormMongoConfig(
        [Veiculo],
        configService),
      inject: [ConfigService],
    }),
    ControleVeiculosModule, // Import the module with our use cases and repository
  ],
  controllers: [ControleVeiculosWebHookController],
  providers: [],
})
export class AppModule { }