import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegistroPonto } from './RegistroPonto.entity';

@Entity({ name: 'PIXIE_ARQUIVO_AFD_MARCACAO' })
export class TipoMarcacaoPonto {
  @PrimaryGeneratedColumn('increment', { name: 'ID' })
  id: number;

  @Column({ type: 'varchar', length: 2, name: 'MARCACAO' })
  marcacao: string;

  @OneToOne(() => RegistroPonto, { eager: true })
  @JoinColumn({ name: 'REGISTROID' })
  registroPonto: RegistroPonto;
}
