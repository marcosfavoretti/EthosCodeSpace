import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  ValidateIf,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './Attachment.dto';

export class SendEmailDTO {
  @ApiProperty()
  @IsString()
  @ValidateIf((o) => !o.text)
  html?: string;
  @ApiProperty()
  @IsString()
  @ValidateIf((o) => !o.html)
  text?: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  to: string[];
  @ApiProperty({
    description:
      'Array de caminhos de arquivos (string) ou objetos de anexo (AttachmentDto) com conteúdo base64.',
    oneOf: [
      { type: 'array', items: { type: 'string' } },
      { type: 'array', items: { $ref: '#/components/schemas/AttachmentDto' } },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto) // This helps with validation for AttachmentDto objects
  attachments?: (string | AttachmentDto)[];
}
