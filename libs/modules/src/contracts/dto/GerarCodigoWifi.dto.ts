import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength, IsString } from "class-validator"; // <--- Importe o MinLength

export class GerarCodigoWifiDTO {
    @ApiProperty()
    @IsString()
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' }) // <--- Correto para texto
    visitanteNome: string;

    @ApiProperty()
    @IsString()
    @MinLength(3, { message: 'A empresa deve ter no mínimo 3 caracteres' }) // <--- Correto para texto
    visitanteEmpresa: string;

    @ApiProperty()
    @IsEmail()
    visitanteEmail: string;
}