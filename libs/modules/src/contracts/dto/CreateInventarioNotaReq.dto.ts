import { ApiProperty } from "@nestjs/swagger";

export class CreateInventarioNotaReqDTO {
    @ApiProperty()
    id: number;
    @ApiProperty()
    cod_item: string;
    @ApiProperty()
    cod_local_estoq: string;
    @ApiProperty()
    den_item_reduz: string;
    //qrcode
    // @ApiProperty()
    // cod_item_badcode;
    // @ApiProperty()
    // cod_local_estoq_barcode;
    // @ApiProperty()
    // cod_item_qr;
}