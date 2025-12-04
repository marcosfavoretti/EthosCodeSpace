import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GaleriaCreateImagePackDto {
  @ApiProperty()
  @IsString()
  author: string;
}
