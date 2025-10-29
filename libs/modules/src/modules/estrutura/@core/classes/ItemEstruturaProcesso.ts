import { ItemEstrutura } from "./ItemEstrutura";
import { Processos } from "./Processos";

export class ItemEstruturaProcesso {
    constructor(
        public itemEstrutura: ItemEstrutura,
        public processos: Processos[] = []
    ) {}
}
