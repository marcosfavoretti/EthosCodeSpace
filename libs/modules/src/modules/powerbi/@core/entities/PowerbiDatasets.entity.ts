import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'PowerbiDatasets'
})
export class PowerbiDatasets {
    @PrimaryGeneratedColumn()
    PowerbiDatasetsID: number;

    @Column('varchar')
    name: string;

    @Column()
    urlDataset: string;

    @Column()
    urlView: string;

    @Column({
        type: 'boolean'
    })
    adminView: boolean;

    private _admin: boolean = false;

    setAdminEnable(): void {
        this._admin = true;
    }

    isAdmin(): boolean {
        return this._admin;
    }
}
