import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsArray, ArrayMinSize, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class NormalPic {
  @ApiProperty({ description: 'Imagem em base64', example: 'data:image/jpeg;base64,...' })
  @IsString()
  @IsNotEmpty()
  Content: string;

  @ApiProperty({ example: 'plate_capture.jpg' })
  @IsString()
  @IsNotEmpty()
  PicName: string;
}

export class Plate {
  @ApiProperty({ type: [Number], example: [100, 200, 300, 400], description: 'Coordenadas [x, y, w, h]' })
  @IsArray()
  @ArrayMinSize(4)
  @IsNumber({}, { each: true })
  BoundingBox: number[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  Channel: number;

  @ApiProperty({ example: 0.98 })
  @IsNumber()
  Confidence: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  IsExist: boolean;

  @ApiProperty({ example: 'White' })
  @IsString()
  @IsString()
  PlateColor: string;

  @ApiProperty({ example: 'ABC1D23' })
  @IsString()
  @IsNotEmpty()
  PlateNumber: string;

  @ApiProperty({ example: 'Standard' })
  @IsString()
  PlateType: string;

  @ApiProperty({ example: 'Brazil' })
  @IsString()
  Region: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  UploadNum: number;
}

export class SnapInfo {
  @ApiProperty({ example: '2026-02-19 16:56:00' })
  @IsString()
  @IsNotEmpty()
  AccurateTime: string;

  @ApiProperty()
  @IsBoolean()
  AllowUser: boolean;

  @ApiProperty()
  @IsString()
  AllowUserEndTime: string;

  @ApiProperty()
  @IsBoolean()
  BlockUser: boolean;

  @ApiProperty()
  @IsString()
  BlockUserEndTime: string;

  @ApiProperty()
  @IsNumber()
  DSTTune: number;

  @ApiProperty()
  @IsString()
  DefenceCode: string;

  @ApiProperty({ example: 'CAM-01-ENTRADA' })
  @IsString()
  DeviceID: string;

  @ApiProperty({ example: 'Obverse', description: 'Direção do veículo' })
  @IsString()
  @IsNotEmpty()
  Direction: string;

  @ApiProperty()
  @IsNumber()
  InCarPeopleNum: number;

  @ApiProperty()
  @IsNumber()
  LanNo: number;

  @ApiProperty()
  @IsBoolean()
  OpenStrobe: boolean;

  @ApiProperty()
  @IsString()
  SnapAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  SnapTime: string;

  @ApiProperty()
  @IsNumber()
  TimeZone: number;
}

export class Vehicle {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayMinSize(4)
  @IsNumber({}, { each: true })
  VehicleBoundingBox: number[];

  @ApiProperty({ example: 'Silver' })
  @IsString()
  VehicleColor: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  VehicleSeries: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  VehicleSign: string;

  @ApiProperty({ example: 'Sedan' })
  @IsString()
  VehicleType: string;
}

export class PictureData {
  @ApiProperty({ type: () => NormalPic })
  @ValidateNested()
  @IsOptional()
  @Type(() => NormalPic)
  NormalPic?: NormalPic;

  @ApiProperty({ type: () => Plate })
  @ValidateNested()
  @Type(() => Plate)
  Plate: Plate;

  @ApiProperty({ type: () => SnapInfo })
  @ValidateNested()
  @Type(() => SnapInfo)
  SnapInfo: SnapInfo;

  @ApiProperty({ type: () => Vehicle })
  @ValidateNested()
  @Type(() => Vehicle)
  Vehicle: Vehicle;
}

export class IntelbrasEventDTO {
  @ApiProperty({ type: () => PictureData })
  @ValidateNested()
  @Type(() => PictureData)
  Picture: PictureData;
}