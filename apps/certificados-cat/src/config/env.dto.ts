import { IsString, IsNumber } from 'class-validator';

export class EnvDTO {
  @IsString()
  HOST: string;

  @IsNumber()
  PORT: number;
}
