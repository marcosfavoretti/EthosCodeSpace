import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ITEM_MAN')
export class ItemMan {
    @PrimaryColumn({ name: 'COD_ITEM' })
    codItem: string;

    @Column({ name: 'COD_ROTEIRO' })
    codRoteiro: string;

    @Column({ name: 'NUM_ALTERN_ROTEIRO' })
    numAlternRoteiro: string;
}