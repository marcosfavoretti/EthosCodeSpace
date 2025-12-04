import { CONSULTA } from '@app/modules/modules/buffer/@core/enum/CONSULTA.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsDateString,
  IsDate,
} from 'class-validator'; // Adicionado IsDateString e IsDate

// --- DTO para Item ---
// Geralmente, DTOs devem ser exportadas se forem usadas em vários lugares.
// Aqui, como são aninhadas, podem ser internas ou exportadas para reuso.
export class BufferItemDto {
  @ApiProperty({ description: 'Identificador do item', example: 'ITEM_XYZ' })
  @IsNotEmpty({ message: 'O identificador do item não pode ser vazio.' })
  @IsString({ message: 'O identificador do item deve ser uma string.' })
  Item: string;

  @ApiProperty({ description: 'Tipo do item', example: 'PRODUTO FINAL' })
  @IsNotEmpty({ message: 'O tipo do item não pode ser vazio.' })
  @IsString({ message: 'O tipo do item deve ser uma string.' })
  tipo_item: string;

  @ApiProperty({ description: 'Código do item do cliente', example: 'CLI-001' })
  @IsNotEmpty({ message: 'O item do cliente não pode ser vazio.' })
  @IsString({ message: 'O item do cliente deve ser uma string.' })
  item_cliente: string;
}

// --- DTO para BufferHistorico ---
export class BufferHistoricoDTO {
  @ApiPropertyOptional({
    description: 'ID do histórico de buffer (gerado automaticamente)',
    example: 1,
  })
  @IsOptional() // Adicionado para permitir que seja opcional na entrada (criação)
  @IsNumber()
  id?: number; // Tornando opcional

  @ApiProperty({
    description:
      'Data/Hora do registro (formato ISO 8601, ex: "2025-06-09T10:30:00.000Z" ou "2025-06-09")',
    example: '2025-06-09T09:34:30.000Z',
    // Se você está recebendo uma string ISO formatada (recomendado para datas em APIs)
    // ou se class-transformer já converte para Date.
    // Se a entrada for dd/MM/yyyy, você precisará de um transformador customizado ou mudar para @IsString()
    // e fazer o parse manual no service.
  })
  @IsDate() // Valida que é um objeto Date
  @Type(() => Date) // Transforma a string (se for o caso) em objeto Date
  serverTime: Date; // Tipo Date recomendado para operações internas

  @ApiProperty({
    type: () => BufferItemDto,
    description: 'Dados do item associado ao histórico de buffer',
  })
  @ValidateNested() // Valida as propriedades de BufferItemDto
  @Type(() => BufferItemDto) // Transforma o objeto em instância de BufferItemDto
  item: BufferItemDto;

  @ApiProperty({ description: 'Valor do buffer', example: 123 })
  @IsNotEmpty({ message: 'O valor do buffer não pode ser vazio.' })
  @IsNumber({}, { message: 'O valor do buffer deve ser um número.' }) // Exemplo de mensagem mais específica
  buffer: number;
}

// --- DTO Principal para Resposta de Mercados Intermediários com Buffer ---
export class ResMercadosIntermediarioDoSetorDTO {
  @ApiProperty({
    description: 'ID único do mercado intermediário (gerado automaticamente)',
    example: 101,
    readOnly: true,
  })
  @IsOptional()
  @IsNumber()
  idMercadosIntermediario?: number;

  @ApiProperty({
    description: 'Tipo de consulta associado ao mercado',
    enum: CONSULTA,
    example: CONSULTA._000,
  })
  @IsNotEmpty({ message: 'O tipo de consulta não pode ser vazio.' }) // Adicionado
  @IsEnum(CONSULTA, {
    message: 'O tipo de consulta deve ser um valor válido do enum CONSULTA.',
  })
  consulta: CONSULTA;

  @ApiProperty({
    description: 'Nome do mercado intermediário',
    example: 'MERCADO ABC',
    maxLength: 255, // Assumindo um tamanho comum para varchar
  })
  @IsNotEmpty({ message: 'O nome do mercado não pode ser vazio.' }) // Adicionado
  @IsString({ message: 'O nome do mercado deve ser uma string.' })
  // Você pode adicionar @MaxLength(255) aqui se quiser validar o tamanho da string
  nome: string;

  @ApiProperty({
    isArray: true,
    type: () => BufferHistoricoDTO,
    description: 'Histórico de buffers associado a este mercado.',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BufferHistoricoDTO)
  histBuffer?: BufferHistoricoDTO[];
}
