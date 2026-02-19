import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AttachmentDto {
  @ApiProperty({ description: 'Nome do arquivo com extensão' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({
    description:
      'Conteúdo do arquivo em formato base64. Ex: "JVBERi0xLjQKJdPr6e..."',
  })
  @IsString()
  @IsNotEmpty()
  content: string; // Base64 encoded string

  @ApiProperty({ description: 'Tipo MIME do arquivo. Ex: "application/pdf"' })
  @IsString()
  @IsNotEmpty()
  mimetype: string;
}
