import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class ResPontoRegistroDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsString()
  mat: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pis: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cpf: string;

  @ApiProperty()
  @Type(() => Date) // <--- Transforma string ISO em objeto Date
  @IsDate()         // <--- Valida se é uma data válida
  data: Date;

  @ApiProperty()
  @IsString()
  hora: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  horaNumber: number;

  @ApiProperty()
  @Type(() => Date) // <--- Transforma string ISO em objeto Date
  @IsDate()         // <--- Valida se é uma data válida
  dataHoraAr: Date;
}