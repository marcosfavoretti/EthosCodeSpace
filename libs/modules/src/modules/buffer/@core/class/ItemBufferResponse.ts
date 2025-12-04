import { ApiProperty } from '@nestjs/swagger';
import { ItemXQtdSemanaComBuffer } from '../entities/ItemQtdSemana.entity';
import { Production } from '@app/modules/modules/@syneco/@core/entities/Production.entity';

export class ItemBufferResponse {
  @ApiProperty()
  public Item: string; // Armazena como string no banco

  @ApiProperty()
  public tipo_item: string;

  @ApiProperty()
  public currentBuffer: number;

  @ApiProperty()
  public codClient: string;

  constructor(itemqtdSemana: ItemXQtdSemanaComBuffer, production: Production) {
    this.codClient = (
      production ? production?.getItemCliente()?.Value.trim() : 'sem codigo'
    )!;
    this.Item = itemqtdSemana.Item;
    this.tipo_item = itemqtdSemana.tipo_item;
    this.currentBuffer = itemqtdSemana.currentBuffer;
  }
}
