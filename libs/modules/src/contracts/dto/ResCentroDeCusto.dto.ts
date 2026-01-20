import { CentroDeCusto } from "@app/modules/modules/relogio-de-ponto/@core/entities/CentroDeCusto.entity";
import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ResCentroDeCustoDTO {
    @ApiProperty()
    setor: string;

    @ApiProperty()
    ccid: number

    static fromEntity(entity: CentroDeCusto): ResCentroDeCustoDTO {
        const dto = new ResCentroDeCustoDTO();
        dto.setor = entity.descricao;
        dto.ccid = entity.codigoCC;
        return dto;
    }
}   