import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { GerenciaCargo } from './GerenciaCargo.entity';

@Entity()
export class Cargo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @OneToMany(() => GerenciaCargo, (gerencia) => gerencia.cargo)
  gerencias: GerenciaCargo[];
}
