import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvDto {
  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  WIFI_CHECKOUT_URI: string;

  @IsNumber()
  @IsNotEmpty()
  WIFI_TIME_LIMIT_MINUTES: number;

  @IsString()
  @IsNotEmpty()
  UBIQUITI_SERVICE_URL: string;

  @IsString()
  @IsNotEmpty()
  MONGOUSER: string;

  @IsString()
  @IsNotEmpty()
  MONGOPASSWORD: string;

  @IsString()
  @IsNotEmpty()
  MONGODATABASE: string;

  @IsString()
  @IsNotEmpty()
  MONGOHOST: string;

  @IsString()
  @IsNotEmpty()
  NODE_TLS_REJECT_UNAUTHORIZED: string;

  @IsString()
  @IsNotEmpty()
  UBIQUITI_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  UBIQUITI_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  WIFI_SSID: string;
}
