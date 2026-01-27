import { ObjectId } from "mongodb";
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from "typeorm";

@Entity('WifiCodeMagicLink')
export class WifiCodeMagicLink {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    email: string;

    @Column()
    parameter: string;

    @CreateDateColumn()
    serverTime: Date;

    @Column()
    expire: boolean

    constructor(props?: { 
        email: string,
        parameter: string
    }) {
        // O TypeORM chamará sem props, então precisamos desse IF
        if (props) {
            this.email = props.email;
            this.parameter = props.parameter;
            this.serverTime = new Date();
            this.expire = false;
        }
    }
}