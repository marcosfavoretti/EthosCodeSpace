
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';

class AppSubRoute {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  route: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  desc: string;
}

export class CriaAppRouteReqDto {
  @ApiProperty({
    type: [AppSubRoute],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppSubRoute)
  subRoutes: AppSubRoute[];

  @ApiProperty({
    enum: CargoEnum,
    isArray: true,
  })
  @IsArray()
  @IsEnum(CargoEnum, { each: true })
  cargos: CargoEnum[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  route: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  desc: string;
}
