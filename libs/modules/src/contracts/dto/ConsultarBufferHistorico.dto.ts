import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ConsultarBufferCompactadoDTO {
  @ApiProperty({
    description: 'Data inicial no formato dd-MM-yyyy',
    example: '01-01-2024',
  })
  @IsDateString(
    { strict: true },
    { message: 'startDate deve estar no formato dd-MM-yyyy' },
  )
  startDate: Date;
  @ApiProperty({
    description: 'Data inicial no formato dd-MM-yyyy',
    example: '01-01-2024',
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'startDate deve estar no formato dd-MM-yyyy' },
  )
  endDate: Date;
}
