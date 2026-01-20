import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { ItemComCapabilidade } from '../entities/Item.entity';
import { Pedido } from '../entities/Pedido.entity';

export class PlanejamentoTemporarioBuilder {
  private _pedido: Pedido;
  private _item: ItemComCapabilidade;
  private _qtd: number;
  private _setor: CODIGOSETOR;
  private _dia: Date;
  private _planejamentoSnapShotId?: number;

  pedido(pedido: Pedido): PlanejamentoTemporarioBuilder {
    this._pedido = pedido;
    return this;
  }

  item(item: ItemComCapabilidade): PlanejamentoTemporarioBuilder {
    this._item = item;
    return this;
  }

  qtd(qtd: number): PlanejamentoTemporarioBuilder {
    this._qtd = qtd;
    return this;
  }

  setor(setor: CODIGOSETOR): PlanejamentoTemporarioBuilder {
    this._setor = setor;
    return this;
  }

  dia(dia: Date): PlanejamentoTemporarioBuilder {
    this._dia = dia;
    return this;
  }

  planejamentoSnapShotId(id: number): PlanejamentoTemporarioBuilder {
    this._planejamentoSnapShotId = id;
    return this;
  }

  build(): PlanejamentoTemporario {
    const planejamento = new PlanejamentoTemporario();
    planejamento.pedido = this._pedido;
    planejamento.item = this._item;
    planejamento.qtd = this._qtd;
    planejamento.setor = this._setor;
    planejamento.dia = this._dia;
    planejamento.planejamentoSnapShotId = this._planejamentoSnapShotId;
    return planejamento;
  }
}
