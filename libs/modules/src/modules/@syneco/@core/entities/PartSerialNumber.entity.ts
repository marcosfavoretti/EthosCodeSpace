import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'PartSerialNumber',
})
export class PartSerialNumber {
  @PrimaryGeneratedColumn()
  PartSerialNumberID;
  @Column('varchar')
  SerialNumber: string;
  @Column('varchar')
  PartCode: string;
  @Column('varchar')
  LoweringPlace: string;
  @Column('varchar')
  Weight: string;
  @Column('int')
  AllowMultipleReports: number;
  @Column('int')
  Exported: number;
  @CreateDateColumn()
  RegistryTimeStamp: Date;
  @Column('datetime')
  UpdateTimeStamp: Date;
}
