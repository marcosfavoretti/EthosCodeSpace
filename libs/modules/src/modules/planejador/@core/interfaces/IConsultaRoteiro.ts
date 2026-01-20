import { ItemComCapabilidade } from '../entities/Item.entity';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';

export interface IConsultaRoteiro {
  roteiro(partcode: ItemComCapabilidade): Promise<CODIGOSETOR[]>;
}
export const IConsultaRoteiro = Symbol('IConsultaRoteiro');
