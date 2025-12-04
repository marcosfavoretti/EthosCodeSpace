import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ITEM')
export class Item {
  @PrimaryColumn({ name: 'COD_ITEM' })
  codItem: string;

  @Column({ name: 'DEN_ITEM_REDUZ', nullable: true })
  denItemReduz: string;

  @Column({ name: 'IES_TIP_ITEM', nullable: true })
  iesTipItem: string;
}
