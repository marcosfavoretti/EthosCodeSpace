import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsObject, IsString } from 'class-validator';

export class ConsultaPorPartcodeReqDTO {
  @ApiProperty({
    description: 'O partcode do item',
    example: '20-000-00220',
    type: String,
  })
  @IsObject()
  @Transform(({ value }) => new Partcode(value))
  partcode: Partcode;
}
