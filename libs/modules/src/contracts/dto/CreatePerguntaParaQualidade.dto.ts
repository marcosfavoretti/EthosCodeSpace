import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePerguntaParaQualidadeDTO {
  @ApiProperty()
  @IsString()
  nSerie: string;
  @ApiProperty()
  @IsString()
  codItem: string;
  @ApiProperty()
  @IsString()
  gate: string;
}
