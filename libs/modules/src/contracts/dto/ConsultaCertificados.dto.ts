import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from './Paginator.dto';

export class ConsultaCertificadosDTO extends PaginationDTO {
  @ApiPropertyOptional({
    description: 'Filtra pelo nome do produto.',
    example: '6177027',
  })
  @IsOptional()
  @IsString()
  produto?: string;

  @ApiPropertyOptional({
    description: 'Filtra pelo número de série.',
    example: 'ETH28112513',
  })
  @IsOptional()
  @IsString()
  seriaNumber?: string;
}
