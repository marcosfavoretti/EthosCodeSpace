import { Partcode } from "../../../shared/classes/Partcode";
import { ItemEstrutura } from "../classes/ItemEstrutura";
import { ItemDto } from "../../logix/infra/DAO/dto/Item.dto"; // This path will need to be adjusted later
import { ItemRelationDto } from "../../logix/infra/DAO/dto/ItemRelation.dto"; // This path will need to be adjusted later
import { EstruturaDto } from "../../logix/infra/DAO/dto/Estrutura.dto"; // This path will need to be adjusted later


export interface IEstruturaRepository {
    getItens(estrutura: Partcode, partcodes: Partcode[]): Promise<ItemEstrutura[]>;
    verificaNaEstrutura(estrutura: string, partcodes: string[]): Promise<boolean>;
    deleteEstrutura(partcodeFinal: Partcode): Promise<void>;
    getItensDeControle(partcode: Partcode): Promise<ItemDto[]>;
    commitItem(param: ItemDto): Promise<void>;
    getEstruturaDepth(partcodeFinal: Partcode): Promise<number>;
    checkNodeExists(partcode: string): Promise<boolean>;
    checkLinkExist(father: string, child: string): Promise<boolean>;
    searchByOperationInHierarchy(itemfinal: Partcode, operation: string): Promise<ItemRelationDto[]>;
    link(param: ItemRelationDto): Promise<void>;
    getItem(partcode: Partcode): Promise<ItemDto | undefined>;
    getEstruturaAsList(partcodeFinal: Partcode): Promise<ItemEstrutura[] | undefined>;
    getEstrutura(partcodeFinal: Partcode): Promise<EstruturaDto | undefined>;
    listEstruturasDependentes(partcode: Partcode): Promise<Array<ItemDto>>; 
    listEstruturas(): Promise<ItemDto[]>;
}