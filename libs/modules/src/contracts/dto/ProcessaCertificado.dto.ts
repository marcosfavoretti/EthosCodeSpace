import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProcessaCertificadoDTO {
  @IsString()
  @ApiProperty()
  filepath: string;
}
