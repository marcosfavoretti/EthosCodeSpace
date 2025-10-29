import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('MAN_PROCESSO_ITEM')
export class ManProcessoItem {
    @PrimaryColumn({ name: 'ITEM' })
    item: string;

    @PrimaryColumn({ name: 'ROTEIRO' })
    roteiro: string;

    @PrimaryColumn({ name: 'ROTEIRO_ALTERNATIVO' })
    roteiroAlternativo: string;

    @Column({ name: 'OPERACAO' })
    operacao: string;

    @Column({ name: 'QTD_TEMPO' })
    qtdTempo: number;
}