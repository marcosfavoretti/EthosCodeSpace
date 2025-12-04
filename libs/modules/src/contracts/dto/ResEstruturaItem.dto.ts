import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class ResEstruturaItemDTO {
  @ApiProperty()
  @IsString()
  status: string;
  @ApiProperty()
  @IsString()
  itemCliente: string;
  @ApiProperty()
  @Transform(({ value }) => (value as Partcode).getPartcodeNum())
  @IsString()
  partcode: Partcode;
  @ApiProperty()
  @IsBoolean()
  ehControle: boolean;
}
