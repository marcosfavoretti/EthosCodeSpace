import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AssingPowerbiDatasetDTO {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    urlDataset: string;
    @ApiProperty()
    @IsString()
    urlView: string;
}