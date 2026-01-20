import { ItemComCapabilidade } from '@app/modules/modules/planejador/@core/entities/Item.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ItemResDto {
  @ApiProperty()
  @IsString()
  Item: string;

  @ApiProperty()
  @IsString()
  tipo_item: string;

  static createByEntity(item: ItemComCapabilidade): ItemResDto {
    const dto = new ItemResDto();
    dto.Item = item.getCodigo();
    dto.tipo_item = item.tipo_item;
    return dto;
  }
}
