import { ApiProperty } from "@nestjs/swagger";

export class ResHorasIrregularesDTO{
    @ApiProperty()
    matricula: string;

    @ApiProperty()
    nome: string;

    @ApiProperty()
    setor: string;

    @ApiProperty()
    horasIrregulares: number;
}