import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@app/modules/modules/user/User.module';
import { AuthController } from './auth/auth.controller';
import { TypeormDevConfigModule } from '@app/modules/config/TypeormDevConfig.module';
import { UserServiceModule } from '@app/modules/modules/user/UserService.module';

@Module({
  imports: [
    TypeormDevConfigModule,
    ConfigModule.forRoot({
      envFilePath: 'apps/user-authenticator/.env',
    }),
    UserServiceModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [],
})
export class UserAuthenticatorModule {}
