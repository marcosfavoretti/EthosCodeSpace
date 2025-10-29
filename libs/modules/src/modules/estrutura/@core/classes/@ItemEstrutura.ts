export class ItemEstrutura {
    constructor(
        public partcode: string,
        public itemCliente: string,
        public qtd: number,
        public status: string,
        public ehControle: boolean
    ) { }

    static create(props: {
        partcode: string,
        itemCliente: string,
        qtd: number,
        status: string,
        ehControle: boolean
    }): ItemEstrutura {
        return new ItemEstrutura(
            props.partcode,
            props.itemCliente,
            props.qtd,
            props.status,
            props.ehControle
        );
    }
}