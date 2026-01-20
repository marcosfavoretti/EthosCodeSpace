import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class EnvDTO {
  @IsString()
  HOST: string;

  @IsNumber()
  PORT: number;

  @IsNumber()
  IGNORA_CERTIFICADOS_INICIAIS: number;

  @IsString()
  APP_MODE: string;

  @IsString()
  MONGOUSER: string;

  @IsString()
  MONGOPASSWORD: string;

  @IsString()
  MONGODATABASE: string;

  @IsString()
  MONGOHOST: string;

  @IsString()
  CERTIFICADOS_CAT_WATCHER_DIR_PATH: string;

  @IsString()
  LOCAL_STORAGE_PATH: string;

  @IsString()
  SECRET: string;

  @IsNumber()
  EXPIREHOURS: number;
}
