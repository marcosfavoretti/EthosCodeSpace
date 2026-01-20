import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import * as datefns from 'date-fns';
import { config } from 'dotenv';
import { ItemComCapabilidade } from './Item.entity';
import { Planejamento } from './Planejamento.entity';
config();

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  codigo: string;

  @Column({ type: 'datetime' })
  dataEntrega: Date;

  @Column()
  lote: number;

  @Column('bit', { default: false })
  processado: boolean;

  @ManyToOne(() => ItemComCapabilidade, { eager: true })
  @JoinColumn({ name: 'item' })
  item: ItemComCapabilidade;

  @CreateDateColumn()
  dataImportacao: Date;

  @OneToMany(() => Planejamento, (plan) => plan.pedido, { onDelete: 'CASCADE' })
  planejamentos: Planejamento[];

  @Column('nvarchar')
  hash: string;

  constructor(
    codigo?: string,
    dataEntrega?: Date,
    item?: ItemComCapabilidade,
    lote?: number,
    processado?: boolean,
    hash?: string,
  ) {
    if (hash) this.hash = hash;
    if (codigo) this.codigo = String(codigo);
    if (dataEntrega) {
      this.dataEntrega = datefns.startOfDay(dataEntrega);
      // this.shipDate = datefns.startOfDay(datefns.addDays(this.dataEntrega, 1));
    }
    if (lote) this.lote = lote;
    this.processado = !!processado;
    if (item) this.item = item;
  }

  ehUrgente(): boolean {
    return datefns.differenceInBusinessDays(this.dataEntrega, new Date()) < 5;
  }

  getSafeDate(): Date {
    return datefns.startOfDay(datefns.subDays(this.dataEntrega, 0));
  }

  pedidoEhValido(): boolean {
    return !!this.item && !!this.item.itemCapabilidade;
  }

  processaPedido(): void {
    this.processado = true;
  }

  getItem(): ItemComCapabilidade {
    return this.item;
  }

  getLote(): number {
    return this.lote;
  }
}
