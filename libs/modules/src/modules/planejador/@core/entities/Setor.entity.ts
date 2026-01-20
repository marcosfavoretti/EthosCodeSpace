import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';

@Entity()
export class Setor {
  @PrimaryColumn({
    type: 'varchar',
  })
  codigo: CODIGOSETOR;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  nome: string;
}
