import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class ItemEstruturaResDTO {
    @ApiProperty()
    @IsString()
    status: string;
    @ApiProperty()
    @IsString()
    itemCliente: string;
    @ApiProperty()
    @IsString()
    partcode: string;
    @ApiProperty()
    @IsBoolean()
    ehControle: boolean;
}