import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ResEstruturaItemDTO } from './ResEstruturaItem.dto';

export class ResEstruturaItemTreeDTO extends PartialType(ResEstruturaItemDTO) {
  @ApiProperty({
    type: () => ResEstruturaItemTreeDTO,
    isArray: true,
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResEstruturaItemTreeDTO)
  @IsOptional()
  children?: ResEstruturaItemTreeDTO[];

  @ApiProperty({ type: () => ResEstruturaItemDTO, required: false })
  @IsObject()
  @ValidateNested()
  @Type(() => ResEstruturaItemDTO)
  @IsOptional()
  father?: ResEstruturaItemDTO;
}
