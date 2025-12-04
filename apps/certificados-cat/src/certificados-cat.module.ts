import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CertificadosCatController } from './delivery/certificados-cat.controller';
import { validate } from './config/env.validation';
import { CertificadosCatModule } from '@app/modules/modules/certificadosCat/CertificadosCat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormMongoConfig } from '@app/modules/config/TypeormMongoConfig.module';
import { CertificadosCatEntity } from '@app/modules/modules/certificadosCat/@core/entities/CertificadoCat.entity';
import { DirWatcherService } from './delivery/dir-watcher.controller';
import { StorageModule } from '@app/modules/modules/storage/Storage.module';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: 'apps/certificados-cat/.env',
    }),
    TypeOrmModule.forRootAsync({
      name: 'mongo',
      imports: [ConfigModule],
      useFactory: (c: ConfigService) => typeormMongoConfig([CertificadosCatEntity], c),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.get<string>('EXPIREHOURS') || '3600',
            10,
          ),
        },
      }),
      inject: [ConfigService],
    }),
    StorageModule,
    CertificadosCatModule,
  ],
  providers: [DirWatcherService, JwtGuard],
  controllers: [CertificadosCatController],
})
export class CertificadosCatModuleApi { }
