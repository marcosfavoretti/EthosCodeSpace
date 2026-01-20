import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Setor } from './Setor.entity';
import { ItemComCapabilidade } from './Item.entity';
/**
 * @deprecated
 */

@Entity()
export class Batelada {
  @PrimaryGeneratedColumn('increment')
  bateladaId: number;

  @ManyToOne(() => Setor)
  @JoinColumn({ name: 'setorid' })
  setor: Setor;

  @ManyToOne(() => ItemComCapabilidade)
  @JoinColumn({ name: 'item' })
  item: ItemComCapabilidade;

  // @Column({
  //     default: () => `DATETIME('now', 'localtime')`,
  //     type: 'datetime'
  // })
  @CreateDateColumn()
  dia: Date;

  qtd: number;
}
