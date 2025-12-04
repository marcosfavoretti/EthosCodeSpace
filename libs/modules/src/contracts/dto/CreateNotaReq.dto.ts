import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateInventarioNotaReqDTO } from './CreateInventarioNotaReq.dto';
import { __InventarioAlmox } from '@app/modules/modules/notas/@core/consts/symbols';

export class CreateNotaReqDTO {
  @ApiProperty({
    example: __InventarioAlmox.toString(),
  })
  @IsString({
    message: 'O campo "tipo" deve ser uma string.',
  })
  tipo: string;

  @ApiProperty({
    isArray: true,
    type: CreateInventarioNotaReqDTO,
  })
  @IsOptional()
  payload: CreateInventarioNotaReqDTO[] | any[];
}
