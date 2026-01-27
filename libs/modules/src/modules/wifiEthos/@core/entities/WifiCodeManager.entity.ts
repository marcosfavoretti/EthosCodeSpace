import { ObjectId } from "mongodb";
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from "typeorm";

@Entity('WifiCodeManager')
export class WifiCodeManager {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    ethosEmail: string;

    @Column()
    visitanteEmail

    @Column()
    visitanteNome: string;

    @Column()
    visitanteEmpresa: string;

    @Column()
    code: string;

    @CreateDateColumn()
    serverTime: Date;

    constructor(
        props?: {
            ethosEmail: string,
            visitanteEmail: string,
            visitanteNome: string,
            visitanteEmpresa: string,
            code: string
        }
    ) {
        if (props) {
            this.ethosEmail = props.ethosEmail;
            this.visitanteEmail = props.visitanteEmail;
            this.visitanteNome = props.visitanteNome;
            this.visitanteEmpresa = props.visitanteEmpresa;
            this.code = props.code;
            this.serverTime = new Date();
        }
    }
}