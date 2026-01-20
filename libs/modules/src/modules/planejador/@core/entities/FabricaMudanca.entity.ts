import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fabrica } from './Fabrica.entity';
import { User } from '@app/modules/modules/user/@core/entities/User.entity';

@Entity()
export class FabricaMudanca {
  @PrimaryGeneratedColumn()
  fabricaMudancaId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  autor: User;

  // @Column('json')
  // mudancaLog: any;

  @Column('text')
  mudancaLog: any;

  @Column({ type: 'date' })
  severTime: Date;

  @ManyToOne(() => Fabrica)
  @JoinColumn({ name: 'fabricaId' })
  fabrica: Fabrica;
}
