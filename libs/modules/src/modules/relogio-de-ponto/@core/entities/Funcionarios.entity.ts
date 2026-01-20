import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CentroDeCusto } from './CentroDeCusto.entity';

@Entity({ name: 'SRA010' })
export class Funcionario {
  @PrimaryColumn({ name: 'RA_PIS' })
  pis: string;

  @Column({ name: 'RA_NOME' })
  nome: string;

  @Column({ name: 'RA_CIC' })
  cic: string;

  @Column({ name: 'RA_MAT' })
  matricula: string;

  @ManyToOne(()=> CentroDeCusto, { eager: true })
  @JoinColumn({ name: 'RA_CC' })
  centroDeCusto: CentroDeCusto;

  @Column({ name: 'RA_SITFOLH', type: 'char' })
  demitido: 'D' | null;
}
