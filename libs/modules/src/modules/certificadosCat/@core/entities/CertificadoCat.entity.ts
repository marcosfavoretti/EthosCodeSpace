import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity({name: 'CertificadosCat'})
export class CertificadosCatEntity {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    produto: string;

    @Column()
    serialNumber: string;

    @Column()
    serverTime: Date;

    @Column()
    certificadoPath: string;
}