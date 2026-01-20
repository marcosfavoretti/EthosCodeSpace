import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

export class AppSubRoute {
  @Column()
  name: string;

  @Column()
  route: string;

  @Column()
  desc: string;
}

@Entity({ name: 'AppRoute' })
export class AppRoute {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  subRoutes: AppSubRoute[];

  @Column()
  cargos: CargoEnum[];

  @Column()
  name: string;

  @Column()
  route: string;

  @Column()
  desc: string;
}
