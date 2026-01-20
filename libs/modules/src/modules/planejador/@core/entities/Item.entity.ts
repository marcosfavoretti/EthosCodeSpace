import { Entity, OneToMany } from 'typeorm';
import { ItemCapabilidade } from './ItemCapabilidade.entity';
import { ItemXQtdSemana } from '@app/modules/modules/@syneco/@core/entities/ItemXQtdSemana.entity';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';

@Entity({ name: 'item_x_qtdsemana', synchronize: false })
export class ItemComCapabilidade extends ItemXQtdSemana{

  @OneToMany(() => ItemCapabilidade, (item) => item.item, {
    eager: true,
    cascade: true,
  })
  itemCapabilidade: ItemCapabilidade[];

  public getCodigo(): string {
    return this.Item;
  }

  public getTipoItem(): string {
    return this.tipo_item;
  }

  public toString(): string {
    return this.Item;
  }

  public getLeadtime(setor: CODIGOSETOR): number {
    const result =
      this.itemCapabilidade.find((c) => c.setor.codigo === setor) ||
      Error('Não foi achada a operação no item');
    if (result instanceof Error) throw result;
    return result.leadTime;
  }

  public capabilidade(setor: CODIGOSETOR): number {
    const result =
      this.itemCapabilidade.find((c) => c.setor.codigo === setor) ||
      Error('Não foi achada a operação no item');
    if (result instanceof Error) {
      console.log(`Capabilidade do setor ${setor} ${this.Item}`);
      throw result;
    }
    return result.capabilidade;
  }
}
