import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class ConsultaPlanejamentosDTO {
  @ApiProperty()
  @IsString()
  fabricaId: string;

  @ApiProperty({ type: Date })
  @IsDate()
  dataInicial: Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDate()
  dataFinal?: Date;
}
