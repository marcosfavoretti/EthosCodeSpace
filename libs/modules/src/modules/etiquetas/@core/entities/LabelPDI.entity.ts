import { Production } from '@app/modules/modules/@syneco/@core/entities/Production.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('LabelPdi')
export class LabelPDI {
  @PrimaryGeneratedColumn('increment')
  labelPdiId: number;

  @ManyToOne(() => Production)
  @JoinColumn({ name: 'productionId' })
  production: Production;

  @Column()
  data: string;

  @CreateDateColumn()
  serverTime: Date;
}
