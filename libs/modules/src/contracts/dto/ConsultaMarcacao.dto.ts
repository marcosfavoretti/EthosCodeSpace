import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './Paginator.dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ConsultaMarcacaoDTO extends PaginationDTO {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  indetificador?: string;

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
