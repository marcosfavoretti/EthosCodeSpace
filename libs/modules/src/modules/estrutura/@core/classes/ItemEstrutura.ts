import { Partcode } from "@app/modules/shared/classes/Partcode";
import { Processos } from "./Processos";

export class ItemEstrutura {
    constructor(
        private partcode: Partcode,
        private itemCliente: string,
        private qtd: number,
        private status: string,
        private ehControle: boolean,
        private filhos: Array<ItemEstrutura> = [],
        private itemPai?: ItemEstrutura,
    ) { }

    addFilhos(...filho: ItemEstrutura[]): void {
        this.filhos.push(...filho);
    }

    getEhControle(){
        return this.ehControle;
    }

    getPartcode(): Partcode {
        return this.partcode;
    }
    getChildren(): ItemEstrutura[] {
        return this.filhos;
    }
    getItemPai(): ItemEstrutura | undefined {
        return this.itemPai;
    }
    getStatus(): string {
        return this.status;
    }
    getQtd(): number {
        return this.qtd;
    }
    getCodItemCliente(): string {
        return this.itemCliente;
    }
    isFinal(): boolean {
        return 'F' === this.status;
    }
    static createItem(props: {
        partcode: string,
        ehControle: boolean,
        itemCliente: string,
        qtd: number,
        status: string,
        filhos?: Array<Processos>,
        itemPai?: ItemEstrutura
    }): ItemEstrutura {
        const novoItem = new ItemEstrutura(
            new Partcode(props.partcode),
            props.itemCliente,
            props.qtd,
            props.status,
            props.ehControle,
            [],//sem filhos
            props?.itemPai
        );
        return novoItem;
    }
}