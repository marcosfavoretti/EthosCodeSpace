import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ConsultarCertificadoDTO {
    @ApiProperty()
    @IsString()
    serialNumber: string;
    @ApiProperty()
    @IsString()
    rops: string;
}