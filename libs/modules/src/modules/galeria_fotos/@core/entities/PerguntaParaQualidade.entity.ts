import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QualidadeImagens } from './QualidadeImagens.entity';

@Entity({ name: 'PerguntaParaQualidade' })
export class ReportQualidade {
  @PrimaryGeneratedColumn('increment')
  public perguntaParaQualidadeID: number;

  @Column('varchar')
  public serialNumber: string;

  @OneToMany(
    () => QualidadeImagens,
    (qualidade) => qualidade.perguntaParaQualidade,
    { cascade: true },
  )
  public qualidadeImagens: QualidadeImagens[];

  @Column('varchar')
  public gate: string;

  @Column('datetime')
  public severTime: Date;

  @Column('varchar')
  public codItem: string;
}

// CREATE TABLE PerguntaParaQualidade (
//     perguntaParaQualidadeID INT IDENTITY(1,1) PRIMARY KEY,
//     serialNumber VARCHAR(MAX),
//     description VARCHAR(MAX),
//     ordemProd VARCHAR(MAX)
// );
