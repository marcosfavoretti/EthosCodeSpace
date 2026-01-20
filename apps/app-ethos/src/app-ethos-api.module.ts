import { Module } from '@nestjs/common';
import { AppEthosController } from './delivery/AppEthos.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppEthosModule } from '@app/modules/modules/app-ethos/AppEthos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormMongoConfig } from '@app/modules/config/TypeormMongoConfig.module';
import { AppRoute } from '@app/modules/modules/app-ethos/@core/entities/AppRoute.entity';
import { SharedAuthModule } from '@app/modules/shared/modules/SharedAuth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/app-ethos/.env',
    }),
    TypeOrmModule.forRootAsync({
      name: 'mongo',
      imports: [ConfigModule],
      useFactory: (c: ConfigService) => typeormMongoConfig([AppRoute], c),
      inject: [ConfigService],
    }),
    SharedAuthModule.forRoot(),
    AppEthosModule,
  ],
  providers: [JwtGuard],
  controllers: [AppEthosController],
  exports: [],
})
export class AppEthosApiModule {}
