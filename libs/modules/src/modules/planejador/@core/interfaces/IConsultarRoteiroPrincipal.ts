import { ItemEstruturado } from '../classes/ItemEstruturado';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';

export interface IConsultarRoteiroPrincipal {
  roteiro(itemEstrutura: ItemEstruturado): Promise<CODIGOSETOR[]>;
}
export const IConsultarRoteiroPrincipal = Symbol('IConsultarRoteiroPrincipal');
