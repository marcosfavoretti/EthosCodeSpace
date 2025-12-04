import { ApiProperty } from "@nestjs/swagger";

export class ResPontoFuncionarioDTO{
    @ApiProperty()
    matricula: string;

    @ApiProperty()
    nome: string;
}