import { Column, Entity, ObjectId, ObjectIdColumn, Index } from 'typeorm';

@Entity({ name: 'CertificadosCat' })
export class CertificadosCatEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  produto: string;

  @Index({ unique: true }) // Adiciona a restrição de unicidade aqui
  @Column()
  serialNumber: string;

  @Column()
  serverTime: Date;

  @Column()
  certificadoPath: string;
}
