import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class RefreshPowerbiDatasetDto {
  @ApiProperty({
    description: 'ID do dataset a ser atualizado',
    example: 1,
  })
  @IsNumber()
  datasetID: number;
}