import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConsultaPorIdDto {
  @ApiProperty({
    description: 'classe de consulta generica por ID.',
  })
  @IsString({
    message: 'O id deve ser uma string válida.',
  })
  id: string;
}
