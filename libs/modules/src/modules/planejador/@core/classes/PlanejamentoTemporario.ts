import { Pedido } from '../entities/Pedido.entity';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { PlanejamentoSnapShot } from '../entities/PlanejamentoSnapShot.entity';
import { ItemComCapabilidade } from '../entities/Item.entity';

export class PlanejamentoTemporario {
  pedido: Pedido;
  item: ItemComCapabilidade;
  qtd: number;
  setor: CODIGOSETOR;
  dia: Date;
  planejamentoSnapShotId?: number;

  static createByEntity(
    planejamentoSnapshot: PlanejamentoSnapShot,
  ): PlanejamentoTemporario {
    return {
      planejamentoSnapShotId: planejamentoSnapshot.planejamentoSnapShotId,
      dia: planejamentoSnapshot.planejamento.dia,
      item: planejamentoSnapshot.planejamento.item,
      pedido: planejamentoSnapshot.planejamento.pedido,
      qtd: planejamentoSnapshot.planejamento.qtd,
      setor: planejamentoSnapshot.planejamento.setor.codigo,
    };
  }
}
