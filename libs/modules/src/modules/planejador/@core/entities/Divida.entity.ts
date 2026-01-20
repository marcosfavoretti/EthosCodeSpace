import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedido } from './Pedido.entity';
import { Setor } from './Setor.entity';
import { ItemComCapabilidade } from './Item.entity';

@Entity()
export class Divida {
  @PrimaryGeneratedColumn()
  dividaId: number;

  @Column({ type: 'int' })
  qtd: number;

  @ManyToOne(() => Pedido, { eager: true })
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;

  @ManyToOne(() => Setor, { eager: true })
  @JoinColumn({ name: 'setorId' })
  setor: Setor;

  @ManyToOne(() => ItemComCapabilidade, { eager: true })
  @JoinColumn({ name: 'Item' })
  item: ItemComCapabilidade;

  // @Column({
  //     default: () => `DATETIME('now', 'localtime')`,
  //     type: 'datetime'
  // })

  @CreateDateColumn()
  createdAt: Date;

  copy(): Divida {
    const novo = new Divida();
    novo.pedido = this.pedido;
    novo.qtd = this.qtd;
    novo.setor = this.setor;
    return novo;
  }
}
