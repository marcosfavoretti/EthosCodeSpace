import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { randomUUID } from 'crypto';

export class Image {
  @Column('varchar')
  path: string;

  @Column('varchar')
  name: string;

  x64?: string;
}

@Entity('ImagemPack')
export class ImagemPack {
  @ObjectIdColumn()
  _id: string = this.generateHashId();

  @Column('varchar')
  author: string;

  @CreateDateColumn()
  severTime: Date;

  @Column()
  images: Image[];

  private generateHashId(): string {
    return randomUUID().slice(0, 6); // Gera um hash de 5 dígitos
  }
}
