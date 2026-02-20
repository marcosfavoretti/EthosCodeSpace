import { IsString } from "class-validator";

export class EnvironmentVariables {
  @IsString()
  MONGOUSER: string;

  @IsString()
  MONGOPASSWORD: string;

  @IsString()
  MONGODATABASE: string;

  @IsString()
  MONGOHOST: string;
}
