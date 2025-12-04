import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BufferHistorico } from './BufferHistorico.entity';
import { ItemXQtdSemana } from '@app/modules/modules/@syneco/@core/entities/ItemXQtdSemana.entity';

@Entity({ name: 'item_x_qtdsemana', synchronize: false })
export class ItemXQtdSemanaComBuffer extends ItemXQtdSemana {
  @OneToMany(() => BufferHistorico, (bufferHistorico) => bufferHistorico.item)
  public bufferHistoricos: BufferHistorico[];

  get currentBuffer(): number {
    const todayReport = this.bufferHistoricos?.find(
      (b) => b.serverTime.getTime() === new Date().getTime(),
    );
    return todayReport?.buffer || 0;
  }
}
