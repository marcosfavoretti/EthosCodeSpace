import { randomUUID } from "crypto";
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { Funcionario } from "./Funcionarios.entity";
import { User } from "@app/modules/modules/user/@core/entities/User.entity";


@Entity()
export class FolhaHoraExtra{
    @ObjectIdColumn()
    idFolha: string = randomUUID();

    @Column()
    funcionarios: Omit<Funcionario, `'demitido' | 'cic' | 'pis'`>[];

    @Column({type: 'date'})
    serverTime: Date;
    
    @Column()
    autorId: string;
}