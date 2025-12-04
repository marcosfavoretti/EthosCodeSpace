import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from './Item.entity';

@Entity('ESTRUT_GRADE')
export class EstrutGrade {
  @PrimaryColumn({ name: 'COD_ITEM_PAI' })
  codItemPai: string;

  @PrimaryColumn({ name: 'COD_ITEM_COMPON' })
  codItemCompon: string;

  @Column({ name: 'QTD_NECESSARIA' })
  qtdNecessaria: number;

  @Column({ name: 'DAT_VALIDADE_INI', type: 'date', nullable: true })
  datValidadeIni: Date;

  @Column({ name: 'DAT_VALIDADE_FIM', type: 'date', nullable: true })
  datValidadeFim: Date;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'COD_ITEM_COMPON', referencedColumnName: 'codItem' })
  itemCompon: Item;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'COD_ITEM_PAI', referencedColumnName: 'codItem' })
  itemPai: Item;
}
