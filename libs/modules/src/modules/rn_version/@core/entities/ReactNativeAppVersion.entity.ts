import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ReactNativeAppVersion' })
export class ReactNativeAppVersion {
  @PrimaryGeneratedColumn('increment')
  reactNativeAppVersionID: number;

  @CreateDateColumn()
  severTime: Date;

  @Column('varchar')
  currentVersion: string;
}
