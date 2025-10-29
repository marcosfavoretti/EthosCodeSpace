import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Production } from "./Production.entity";
import { format } from "date-fns";
import { TypeData } from "../enum/TypeData.enum";

@Entity({ name: 'ProductionData' })
export class ProductionData {
    @PrimaryGeneratedColumn('increment')
    public ProductionDataID: number;
    @Column({
        type: 'int',
        enum: TypeData
    })
    public TypeDataID: TypeData;
    @Column('varchar', { length: 512 })
    public Value: string;
    // @Column('bit')
    // public  Enable: boolean;
    @ManyToOne(() => Production, prod => prod.ProductionID)
    @JoinColumn({ name: 'ProductionID' })
    public production: Production;

    generateUniqueCode(): string {
        if (!this.production.PartCode && !this.production.PlannedEndTimestamp) throw new Error('Dependencias vazias');
        return `
            ${format(this.production.PlannedEndTimestamp, 'ddMMyyyy')}${this.production.PartCode.split('-').join('')}
            `
    }
}