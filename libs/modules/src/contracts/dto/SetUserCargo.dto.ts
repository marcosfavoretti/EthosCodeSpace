import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class SetUserCargoDTO {
  @ApiProperty({
    enum: CargoEnum,
  })
  @IsEnum(CargoEnum)
  cargo: CargoEnum;

  @ApiProperty()
  @IsString()
  userId: string;
}
