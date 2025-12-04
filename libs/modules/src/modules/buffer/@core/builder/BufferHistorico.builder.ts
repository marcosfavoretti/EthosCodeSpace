import { format, startOfDay } from 'date-fns';
import { BufferHistorico } from '../entities/BufferHistorico.entity';
import { ItemXQtdSemanaComBuffer } from '../entities/ItemQtdSemana.entity';
import { MercadosIntermediario } from '../entities/MercadosIntermediarios.entity';

export class BufferHistoricoBuilder {
  private bufferHist: BufferHistorico = new BufferHistorico();

  capturaData(): this {
    this.bufferHist.serverTime = startOfDay(new Date());
    return this;
  }

  comId(id: number): this {
    this.bufferHist.id = id;
    return this;
  }

  noMercado(mercado: MercadosIntermediario): this {
    this.bufferHist.mercado = mercado;
    return this;
  }

  comQtdBuffer(qtd: number): this {
    this.bufferHist.buffer = qtd;
    return this;
  }

  comItem(item: ItemXQtdSemanaComBuffer): this {
    this.bufferHist.item = item;
    return this;
  }

  build(): BufferHistorico {
    return this.bufferHist;
  }
}
