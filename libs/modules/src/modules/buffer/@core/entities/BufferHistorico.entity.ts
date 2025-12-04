import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { MercadosIntermediario } from './MercadosIntermediarios.entity';
import { ItemXQtdSemana } from '@app/modules/modules/@syneco/@core/entities/ItemXQtdSemana.entity';
import { ItemXQtdSemanaComBuffer } from './ItemQtdSemana.entity';

// @Entity({ name: 'ETHOS_MET_NCSSP4.dbo.buffer_historico' })
@Entity({ name: 'buffer_historico' })
export class BufferHistorico {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('datetime')
  serverTime: Date;

  @Column('int')
  buffer: number;

  @Exclude()
  @ManyToOne(
    () => ItemXQtdSemanaComBuffer,
    (itemQtdSemana) => itemQtdSemana.bufferHistoricos,
  )
  @JoinColumn({ name: 'Item' })
  item: ItemXQtdSemana;

  @ManyToOne(
    () => MercadosIntermediario,
    (mercadosIntermediario) => mercadosIntermediario.idMercadosIntermediario,
  )
  mercado: MercadosIntermediario;
}
