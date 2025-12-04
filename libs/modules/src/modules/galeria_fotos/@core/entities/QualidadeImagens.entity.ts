import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReportQualidade } from './PerguntaParaQualidade.entity';

@Entity({ name: 'QualidadeImagens' })
export class QualidadeImagens {
  @PrimaryGeneratedColumn('increment')
  idQualidadeImage: number;

  @Column('varchar')
  path: string;

  @ManyToOne(() => ReportQualidade, (pergunta) => pergunta.qualidadeImagens)
  @JoinColumn({ name: 'perguntaParaQualidadeID' })
  perguntaParaQualidade: ReportQualidade;
}

// CREATE TABLE QualidadeImagens (
//     idQualidadeImage INT IDENTITY(1,1) PRIMARY KEY,
//     path VARCHAR(MAX),
//     perguntaParaQualidadeID INT,
//     FOREIGN KEY (perguntaParaQualidadeID) REFERENCES PerguntaParaQualidade(perguntaParaQualidadeID)
// );
