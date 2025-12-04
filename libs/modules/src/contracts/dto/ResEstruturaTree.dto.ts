import { isArray, IsArray, ValidateNested } from 'class-validator';
import { ResEstruturaItemDTO } from './ResEstruturaItem.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ItemEstruturaTree } from '@app/modules/modules/estrutura/@core/classes/ItemEstruturaTree';
import { ResEstruturaItemTreeDTO } from './ResEstruturaItemTree.dto';

export class ResEstruturaTreeDTO {
  @IsArray()
  @Type(() => ResEstruturaItemDTO)
  @ApiProperty({ type: () => ItemEstruturaTree })
  estrutura: ResEstruturaItemTreeDTO;

  @ApiProperty()
  @IsArray()
  @ValidateNested()
  detalhes: object;
}
