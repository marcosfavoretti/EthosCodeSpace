import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ResEstruturaItemDTO } from './ResEstruturaItem.dto';

export class ResEstruturaDependentesDTO {
  @ApiProperty({ type: () => ResEstruturaItemDTO })
  @ValidateNested()
  @Type(() => ResEstruturaItemDTO)
  target: ResEstruturaItemDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResEstruturaItemDTO)
  @ApiProperty({ type: () => ResEstruturaItemDTO, isArray: true })
  depedencias: ResEstruturaItemDTO[];
}
