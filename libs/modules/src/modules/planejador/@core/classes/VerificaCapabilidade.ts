import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { ItemComCapabilidade } from '../entities/Item.entity';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { IVerificaCapacidade } from '../interfaces/IVerificaCapacidade';

export class VerificaCapabilidade implements IVerificaCapacidade {
  constructor(
    private item: ItemComCapabilidade,
    private setor: CODIGOSETOR,
  ) {
    if (!item.getCodigo().match('-000-')) {
      throw new Error(
        'Só esperados itens 000 aqui. Pois só eles tem leadTimes',
      );
    }
  }

  calculaCapacidade(qtd: number): number {
    return this.item.capabilidade(this.setor) - qtd;
  }

  verificaCapacidade(qtd: number): boolean {
    return this.item.capabilidade(this.setor) <= qtd;
  }

  consumes(plan: PlanejamentoTemporario): boolean {
    return plan.item.getCodigo() === this.item.getCodigo();
  }
}
