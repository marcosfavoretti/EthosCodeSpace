import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ResBufferHistoricoDto {
  @ApiProperty({ example: 1, description: 'ID do histórico de buffer' })
  @Expose()
  id: number;

  @ApiProperty({
    example: '2023-10-27T10:00:00Z',
    description: 'Data e hora do registro',
  })
  @Expose()
  @Type(() => Date)
  serverTime: Date;

  @ApiProperty({ example: 50, description: 'Valor do buffer' })
  @Expose()
  buffer: number;

  // Se precisar expor item ou mercado, adicione aqui como outros DTOs ou strings
  @ApiProperty({
    example: 'ITEM_XYZ',
    description: 'Identificador do item',
    required: false,
  })
  @Expose()
  itemId?: string; // Exemplo de campo mapeado achatado
}
