import { IsNotEmpty, IsString } from 'class-validator';

export class LocalStorageConfigDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}
