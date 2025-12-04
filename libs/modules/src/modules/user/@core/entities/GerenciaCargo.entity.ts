import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cargo } from './Cargo.entity';
import { User } from './User.entity';
@Entity()
export class GerenciaCargo {
  @PrimaryGeneratedColumn()
  gerenciaCargoId: number;

  @ManyToOne(() => User, (user) => user.cargos)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Cargo, (cargo) => cargo.gerencias, { eager: true })
  @JoinColumn({ name: 'cargoId' })
  cargo: Cargo;
}
