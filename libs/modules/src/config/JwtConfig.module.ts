import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export function jwtConfig(configService: ConfigService): JwtModuleOptions {
  const config: JwtModuleOptions = {
    secret: configService.get<string>('SECRET'),
    signOptions: {
      expiresIn: `${configService.get<number>('EXPIREHOURS')}h`,
    },
  };
  return config;
}
