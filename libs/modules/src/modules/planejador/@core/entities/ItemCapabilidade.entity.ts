import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Setor } from './Setor.entity';
import { ItemComCapabilidade } from './Item.entity';

@Entity({ name: 'item_capabilidade' })
export class ItemCapabilidade {
  @PrimaryGeneratedColumn()
  itemDetailId: number;

  @ManyToOne(() => Setor, { eager: true })
  @JoinColumn({ name: 'setor' })
  setor: Setor;

  @Column('int')
  capabilidade: number;

  @Column('int')
  leadTime: number;

  @ManyToOne(() => ItemComCapabilidade)
  @JoinColumn({ name: 'item' })
  item: ItemComCapabilidade;
}
