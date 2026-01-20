import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ItemComCapabilidade } from './Item.entity';
import { PlanejamentoSnapShot } from './PlanejamentoSnapShot.entity';
import { Setor } from './Setor.entity';
import { Pedido } from './Pedido.entity';

@Entity()
export class Planejamento {
  @PrimaryGeneratedColumn()
  planejamentoId: number;

  @ManyToOne(() => ItemComCapabilidade, { eager: true })
  @JoinColumn({ name: 'item' })
  item: ItemComCapabilidade;

  @ManyToOne(() => Setor, { eager: true })
  @JoinColumn({ name: 'setor' })
  setor: Setor;

  @ManyToOne(() => Pedido, { eager: true })
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;

  // @Column({
  //   type: 'datetime',
  //   transformer: {
  //     to(value: Date): string {
  //       const iso = value.toISOString();
  //       return iso.split('.')[0]
  //     },
  //     from(value: string | null): Date {
  //       return new Date(`${value}Z`)
  //     },
  //   },
  // })
  @CreateDateColumn()
  dia: Date;

  @OneToMany(() => PlanejamentoSnapShot, (plan) => plan.planejamento, {
    onDelete: 'CASCADE',
  })
  planejamentoSnapShot: PlanejamentoSnapShot[];

  @Column('int')
  qtd: number;

  copy(): Planejamento {
    const novo = new Planejamento();
    novo.dia = this.dia;
    novo.item = this.item;
    novo.pedido = this.pedido;
    novo.qtd = this.qtd;
    novo.setor = this.setor;
    return novo;
  }
}
