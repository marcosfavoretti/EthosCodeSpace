import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  @Column({ name: 'RA_CC' })
  centroCusto: string;

  @Column({ name: 'RA_SITFOLH', type: 'char' })
  demitido: 'D' | null;
}
