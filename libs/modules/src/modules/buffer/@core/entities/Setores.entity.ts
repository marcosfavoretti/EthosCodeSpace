import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { MercadosIntermediario } from './MercadosIntermediarios.entity';

@Entity()
export class Setores {
  @PrimaryGeneratedColumn('increment')
  idSetor: number;

  @Column('varchar')
  setor: string;

  @Column('varchar', { length: 5 })
  operacao: string;

  @OneToMany(
    () => MercadosIntermediario,
    (mercadosIntermediario) => mercadosIntermediario.setor,
  )
  mercadosIntermediarios: MercadosIntermediario[];
}
