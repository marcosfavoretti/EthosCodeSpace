import { __InventarioAlmox } from "../service/InventarioAlmox.service";
import { Nota } from "./Nota";

export class NotaInventarioAlmox extends Nota {

    private cod_item_barcode: string;
    private cod_local_estoq_barcode: string;
    private cod_item_qr: string;

    constructor(
        public self_id: number,
        public cod_item: string,
        public cod_local_estoq: string,
        public den_item_reduz: string,
    ) {
        super(
            __InventarioAlmox,
        );
    }

    set set_cod_item_barcode(value: string) {
        this.cod_item_barcode = value;
    }

    set set_cod_local_estoq_barcode(value: string) {
        this.cod_local_estoq_barcode = value;
    }

    set set_cod_item_qr(value: string) {
        this.cod_item_qr = value;
    }
}