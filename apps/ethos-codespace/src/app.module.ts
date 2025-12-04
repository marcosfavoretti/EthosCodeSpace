import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DefaultController } from './default.controller';
import { UserModule } from '@app/modules/modules/user/User.module';
import { TypeormDevConfigModule } from '@app/modules/config/TypeormDevConfig.module';
import { UserServiceModule } from '@app/modules/modules/user/UserService.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/ethos-codespace/.env',
    }),
    TypeormDevConfigModule,
    UserServiceModule,
    UserModule,
  ],
  controllers: [DefaultController],
  providers: [],
})
export class AppModule {}
