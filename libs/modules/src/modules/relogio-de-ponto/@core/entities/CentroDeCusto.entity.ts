import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CTT010', {
  comment: 'Tabela de Centro de Custo do protheus',
})
export class CentroDeCusto {
  // Definição das colunas da entidade CentroDeCusto conforme o banco de dados
  @PrimaryColumn({
    name: 'CTT_CUSTO',
  })
  codigoCC: number;

  @Column('varchar', { name: 'CTT_DESC01' })
  descricao: string;
}
