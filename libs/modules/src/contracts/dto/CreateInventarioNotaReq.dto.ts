import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventarioNotaReqDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  cod_item: string;
  @ApiProperty()
  cod_local_estoq: string;
  @ApiProperty()
  den_item_reduz: string;
}
