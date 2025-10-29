import { Partcode } from "@app/modules/shared/classes/Partcode";
import { Processos } from "./Processos";
import { ItemEstrutura } from "./ItemEstrutura";

export class ItemEstruturaOperacoes
    extends ItemEstrutura {

    private constructor(
        partcode: Partcode,
        itemCliente: string,
        qtd: number,
        status: string,
        ehControle: boolean,
        filhos: Array<ItemEstrutura> = [],
        itemPai?: ItemEstrutura,
        private _operacoes: Array<Processos> = []
    ) {
        super(
            partcode,
            itemCliente,
            qtd,
            status,
            ehControle,
            filhos,
            itemPai
        );

    }

    get operacoes(){
        return [...this._operacoes];
    }

    addFilhos(...filho: ItemEstrutura[]): void {
        super.addFilhos(...filho);
    }

    // static createItem(props: {
    //     partcode: string,
    //     ehControle: boolean,
    //     itemCliente: string,
    //     qtd: number,
    //     status: string,
    //     operacao: Array<Processos>,
    //     itemPai?: ItemEstrutura
    // }): ItemEstrutura {
    //     const novoItem = new ItemEstrutura(
    //         new Partcode(props.partcode),
    //         props.itemCliente,
    //         props.qtd,
    //         props.status,
    //         props.ehControle,
    //         [],
    //         props?.itemPai
    //     );
    //     return novoItem;
    // }
}