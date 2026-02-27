import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EnvDto {
  @IsNumber()
  PORT: number;

  @IsString()
  HOST: string;

  @IsNumber()
  WSPORT: number;

  @IsString()
  WSHOST: string;


  @IsString()
  PRODUCTIONRELATION_URL: string

  @IsString()
  @IsOptional()
  APP_MODE: string;

  @IsString()
  MYSQLUSER: string;

  @IsString()
  MYSQLSENHA: string;

  @IsString()
  MYSQLDATABASE: string;

  @IsString()
  MYSQLHOST: string;

  @IsString()
  POWERBIEMAIL: string;

  @IsString()
  POWERBISENHA: string;

}
