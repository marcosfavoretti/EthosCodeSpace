import { Entity, PrimaryColumn, OneToMany, Column } from "typeorm";

@Entity({ name: 'item_x_qtdsemana' })
export class ItemXQtdSemana {
    @PrimaryColumn()
    Item: string;

    @Column({ nullable: true })
    tipo_item: string;

    public getCodigo(): string {
        return this.Item;
    }

    public getTipoItem(): string {
        return this.tipo_item;
    }

    public toString(): string {
        return this.Item;
    }

}