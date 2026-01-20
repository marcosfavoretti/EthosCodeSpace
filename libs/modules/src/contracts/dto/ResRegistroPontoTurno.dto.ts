import { ApiProperty } from "@nestjs/swagger";
import { ResTipoMarcacaoDTO } from "./ResTipoMarcacao.dto";
import { number } from "joi";

export class ResRegistroPontoTurnoPontoDTO {
    @ApiProperty()
    matricula: string;

    @ApiProperty()
    setor: string;

    @ApiProperty()
    nome: string;

    @ApiProperty()
    turnoDia: Date;

    @ApiProperty()
    turnoDiaStr: string;

    @ApiProperty({
        isArray: true,
        type: ResTipoMarcacaoDTO
    })
    registros: ResTipoMarcacaoDTO[];

    @ApiProperty({
        type: number
    })
    qtdHoras: number;

    @ApiProperty()
    horasIrregulares: number;
}