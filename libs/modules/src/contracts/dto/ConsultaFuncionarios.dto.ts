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
}
