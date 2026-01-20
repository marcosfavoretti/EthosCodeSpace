import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from './Paginator.dto';

export class ConsultaFuncionariosDTO extends PaginationDTO {
  @ApiProperty({
    required: false,
    description: 'Filtro por centro de custo (RA_CC)',
  })
  @IsOptional()
  @IsString()
  RA_CC?: string;

  @ApiProperty({
    required: false,
    description: 'Filtro por cpf',
  })
  @IsOptional()
  @IsString()
  CPF?: string;

  @ApiProperty({
    required: false,
    description: 'Filtro por PIS',
  })
  @IsOptional()
  @IsString()
  PIS?: string;

  @ApiProperty({
    required: false,
    description: 'Filtro por matricula',
  })
  @IsOptional()
  @IsString()
  matricula?: string;

  @ApiProperty({
    required: false,
    description: 'Filtro por nome do funcionário',
  })
  @IsOptional()
  @IsString()
  nome?: string;
}
