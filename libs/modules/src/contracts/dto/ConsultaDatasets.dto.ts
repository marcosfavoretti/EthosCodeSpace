import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConsultaDatasetsDto {
  @ApiProperty({
    description: 'Email do usuário para filtro de admin',
    example: 'admin@empresa.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  user?: string;
}