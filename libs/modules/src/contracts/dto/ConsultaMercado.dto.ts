import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class ConsultaMercadoDTO {
  @ApiProperty()
  @IsNumber()
  setorId: number;

  @ApiProperty()
  @IsDate()
  dia: string;
}
