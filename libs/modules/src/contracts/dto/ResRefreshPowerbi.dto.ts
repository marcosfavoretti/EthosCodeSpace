import { ApiProperty } from '@nestjs/swagger';

export class ResRefreshPowerbi {
  @ApiProperty({
    description: 'ID do dataset',
    example: 1,
  })
  PowerbiDatasetsID: number;

  @ApiProperty({
    description: 'Nome do dataset',
    example: 'Vendas Mensais',
  })
  name: string;

  @ApiProperty({
    description: 'URL do dataset',
    example: 'https://app.powerbi.com/dataset/abc123',
  })
  urlDataset: string;

  @ApiProperty({
    description: 'URL da view do dashboard',
    example: 'https://app.powerbi.com/view/xyz789',
  })
  urlView: string;

  @ApiProperty({
    description: 'Indica se o dashboard é visível apenas para administradores',
    example: false,
  })
  adminView: boolean;
}