import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';

export class CreateNotaPdiEtiquetaDTO {
  @ApiProperty()
  @IsString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/, {
    message: 'serialNumber must be in the format ddMMyyNN (ex., 01012401)',
  })
  serialNumber: string;
  @ApiProperty()
  @IsString()
  @MaxLength(8)
  @Matches(/^\d{1,8}$/, { message: 'A ordem deve ter apenas numeros' })
  orderNum: string;
}
