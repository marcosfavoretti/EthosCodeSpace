import { IsObject, IsString } from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class CompactBuffer {
  @IsString()
  @ApiProperty()
  item: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  serverTime: string | number;

  @IsString()
  @ApiProperty()
  tipo_item: string;

  @IsString()
  @ApiProperty()
  ItemFiho: string;

  [mercados: string]: number | string;
}
