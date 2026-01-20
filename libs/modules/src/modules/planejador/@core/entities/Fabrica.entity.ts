import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanejamentoSnapShot } from './PlanejamentoSnapShot.entity';
import { FabricaBuilder } from '../builder/Fabrica.builder';
import { DividaSnapShot } from './DividaSnapShot.entity';
import { User } from '@app/modules/modules/user/@core/entities/User.entity';

@Entity({ name: 'fabrica' })
export class Fabrica {
  @PrimaryGeneratedColumn('uuid')
  fabricaId: string;

  @CreateDateColumn()
  date: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('bit')
  principal: boolean;

  @ManyToOne(() => Fabrica, (fabrica) => fabrica.childrenFabricas, {
    nullable: true,
  })
  @JoinColumn({ name: 'fabricaPaiId' })
  fabricaPai?: Fabrica;

  @Column('bit')
  checkPoint: boolean;

  @OneToMany(() => Fabrica, (fabrica) => fabrica.fabricaPai)
  childrenFabricas: Fabrica[];

  @OneToMany(() => PlanejamentoSnapShot, (plan) => plan.fabrica, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  planejamentoSnapShots: PlanejamentoSnapShot[];

  @OneToMany(() => DividaSnapShot, (dividaSnapShot) => dividaSnapShot.fabrica, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  dividasSnapShots: DividaSnapShot[];

  //  @OneToMany(() => MercadoSnapShot, (mercado) => mercado.fabrica, {
  //   onDelete: 'CASCADE',
  //   cascade: true,
  // })
  // mercadoSnapShots: MercadoSnapShot[];

  enableCheckPoint(): void {
    this.checkPoint = true;
    1;
  }

  appendDividas(dividas: DividaSnapShot[]): void {
    if (!this.dividasSnapShots) {
      this.dividasSnapShots = [];
    }
    this.dividasSnapShots.push(...dividas);
  }

  appendPlanejamento(planejamentoSnapShots: PlanejamentoSnapShot[]): void {
    if (!this.planejamentoSnapShots) {
      this.planejamentoSnapShots = [];
    }
    this.planejamentoSnapShots.push(...planejamentoSnapShots);
  }

  restart(): Fabrica {
    if (this.principal)
      throw new Error('disponível apenas em fabrica privadas');
    const nova = new FabricaBuilder()
      .checkPoint(false)
      .principal(this.principal)
      .fabricaPai(this.fabricaPai!)
      .userId(this.user)
      .build();
    nova.fabricaId = this.fabricaId;
    return nova;
  }

  copy(props: { user: User; isPrincipal: boolean }): Fabrica {
    return new FabricaBuilder()
      .checkPoint(false)
      .principal(props.isPrincipal)
      .fabricaPai(this)
      .userId(props.user)
      .build();
  }
}
