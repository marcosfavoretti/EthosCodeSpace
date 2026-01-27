import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Matches } from "class-validator";

export class SolicitarCodigoWifiDTO {
    @ApiProperty()
    //valida se o email é do dominio ethos.ind.br
    @IsEmail()
    @Matches(/@ethos\.ind\.br$/, { message: 'O email deve ser do domínio ethos.ind.br' })
    email: string;
}