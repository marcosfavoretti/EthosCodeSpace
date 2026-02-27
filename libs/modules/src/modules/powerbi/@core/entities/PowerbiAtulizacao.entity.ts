import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { PowerbiDatasets } from "./PowerbiDatasets.entity";

@Entity({
    name: 'PowerbiAtualizacoes'
})
export class PowerbiAtualizacoes {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => PowerbiDatasets, dataset => dataset.PowerbiDatasetsID)
    @JoinColumn({name: 'dataset'})
    dataset: PowerbiDatasets;

    @CreateDateColumn()
    severTime: Date;
}

