import { isArray, IsArray, ValidateNested } from 'class-validator';
import { ResEstruturaItemDTO } from './ResEstruturaItem.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ResEstruturaListaDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResEstruturaItemDTO)
  @ApiProperty({ type: () => ResEstruturaItemDTO, isArray: true })
  estrutura: ResEstruturaItemDTO[];

  @ApiProperty()
  @IsArray()
  @ValidateNested()
  detalhes: object;
}
