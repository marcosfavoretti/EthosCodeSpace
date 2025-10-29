import { __NotaAlmox } from "../service/AlmoxNota.service";
import { Nota } from "./Nota";

export class NotaAlmox extends Nota {
    constructor(){
        super(
            __NotaAlmox
        );
    }
}