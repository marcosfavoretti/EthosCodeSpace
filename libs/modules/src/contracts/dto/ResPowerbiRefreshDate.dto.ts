import { ApiProperty } from '@nestjs/swagger';

export class ResPowerbiRefreshDate {
  @ApiProperty({
    description: 'Data e hora da última atualização do dataset',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  severTime: Date | null;
}