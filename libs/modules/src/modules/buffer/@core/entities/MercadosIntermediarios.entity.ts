import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Setores } from './Setores.entity';
import { BufferHistorico } from './BufferHistorico.entity';
import { CONSULTA } from '../enum/CONSULTA.enum';

@Entity()
export class MercadosIntermediario {
  @PrimaryGeneratedColumn('increment')
  idMercadosIntermediario: number;

  @Column({
    enum: CONSULTA,
    type: 'varchar',
  })
  consulta: CONSULTA;

  @Column('varchar')
  nome: string;

  @ManyToOne(() => Setores, (setor) => setor.mercadosIntermediarios)
  setor: Setores;

  @OneToMany(() => BufferHistorico, (buffer) => buffer.mercado)
  histBuffer: BufferHistorico[];
}
