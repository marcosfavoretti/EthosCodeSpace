import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartSerialNumber } from './PartSerialNumber.entity';
import { Production } from './Production.entity';

@Entity({ name: 'PartSerialNumberProduction' })
export class PartSerialNumberProduction {
  @PrimaryGeneratedColumn()
  PartSerialNumberProductionID: number;
  @ManyToOne(() => PartSerialNumber, (pa) => pa.PartSerialNumberID, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'PartialSerialNumberID' })
  PartialSerialNumberID: PartSerialNumber;
  @ManyToOne(() => Production, (pa) => pa.ProductionID, { eager: true })
  @JoinColumn({ name: 'ProductionID' })
  ProductionID: Production;
  @Column('int', { default: 0 })
  Reported: number;
  @CreateDateColumn()
  RegistryTimeStamp: Date;
}
