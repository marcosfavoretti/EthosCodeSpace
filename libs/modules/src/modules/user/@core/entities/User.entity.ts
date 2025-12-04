import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GerenciaCargo } from './GerenciaCargo.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @ApiProperty()
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsString()
  @Column('varchar')
  email: string;

  @Column('varchar')
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @Column({ nullable: true })
  avatar: string;

  // @Column({
  //     default: () => `DATETIME('now', 'localtime')`,
  //     type: 'datetime'
  // })

  @ApiProperty()
  @IsDate()
  @CreateDateColumn()
  created: Date;
  @OneToMany(() => GerenciaCargo, (gerencia) => gerencia.user, {
    eager: true,
    cascade: ['insert'],
  })
  cargos: GerenciaCargo[];


  get cargosLista(): string[] {
    return this.cargos?.map((c) => c.cargo?.nome) ?? []
  }


  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compareSync(password, this.password);
  }
}
