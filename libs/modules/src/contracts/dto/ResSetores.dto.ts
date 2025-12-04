import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResSetorDTO {
  @ApiProperty({
    description: 'ID único do setor (gerado automaticamente)',
    example: 1,
    readOnly: true, // Indica que este campo é apenas para leitura na resposta
  })
  @IsNumber()
  idSetor: number; // Opcional para criação, presente para atualização/leitura

  @ApiProperty({
    description: 'Nome do setor',
    example: 'SOLDA',
  })
  @IsString({ message: 'O nome do setor deve ser uma string.' })
  setor: string;

  @ApiProperty({
    description: 'Operação associada ao setor',
    example: '00015',
    maxLength: 5,
  })
  @IsString({ message: 'A operação deve ser uma string.' })
  operacao: string;
}
