import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SaveBufferLogDto {
  @ApiProperty()
  @IsString()
  item: string;

  @ApiProperty()
  @IsNumber()
  qtd: number;

  @ApiProperty()
  @IsString()
  mercadoName: string;
}
