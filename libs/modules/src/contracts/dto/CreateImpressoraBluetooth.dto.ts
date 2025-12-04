import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsMACAddress,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateImpressoraBluetoothDto {
  @ApiProperty({
    description: 'Nome da impressora',
    example: 'Impressora Sala 1',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Endereço MAC da impressora',
    example: '00:1A:79:XX:XX:XX',
  })
  @IsString()
  @IsNotEmpty()
  @IsMACAddress()
  macAddress: string;
}
