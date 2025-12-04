import { ApiProperty } from '@nestjs/swagger';

export class ImpressoraBluetoothResponseDto {
  @ApiProperty({
    description: 'Identificador único da impressora',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da impressora',
    example: 'Impressora Sala 1',
  })
  nome: string;

  @ApiProperty({
    description: 'Endereço MAC da impressora',
    example: '00:1A:79:XX:XX:XX',
  })
  macAddress: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    format: 'date-time',
  })
  dataCriacao: Date;
}
