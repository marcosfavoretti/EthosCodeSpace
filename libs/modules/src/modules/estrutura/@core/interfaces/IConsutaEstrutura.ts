import { Partcode } from "@app/modules/shared/classes/Partcode";
import { ItemEstrutura } from "../classes/ItemEstrutura"

export interface IConsultaEstrutura {
    getEstrutura(partcodeFinal: Partcode): Promise<ItemEstrutura | undefined>
    getEstruturaAsList(partcodeFinal: Partcode): Promise<ItemEstrutura[] | undefined>
    getItens(estrutura: Partcode, partcodes: Partcode[]): Promise<ItemEstrutura[]>;
    getItensDeControle(partcode: Partcode): Promise<ItemEstrutura[]>
}