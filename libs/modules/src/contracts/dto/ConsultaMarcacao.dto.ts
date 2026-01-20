import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './Paginator.dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ConsultaMarcacaoDTO extends PaginationDTO {
  @ApiProperty({
    required: false,
    description: 'Identificador do funcionário : nome, matrícula, CPF ou PIS',
  })
  @IsOptional()
  @IsString()
  indetificador?: string;


  @ApiProperty({
    required: false,
    description: 'Identificador do centro de custo',
  })
  @IsOptional()
  @IsString()
  ccid?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;
}
