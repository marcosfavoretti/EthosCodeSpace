import { ReportQualidade } from '../entities/PerguntaParaQualidade.entity';
import { QualidadeImagens } from '../entities/QualidadeImagens.entity';

export class ReportQualidadeBuilder {
  private perguntaParaQualidade: ReportQualidade;

  constructor() {
    this.perguntaParaQualidade = new ReportQualidade();
  }

  public withReportQualidadeID(id: number): ReportQualidadeBuilder {
    this.perguntaParaQualidade.perguntaParaQualidadeID = id;
    return this;
  }

  public withSerialNumber(serialNumber: string): ReportQualidadeBuilder {
    this.perguntaParaQualidade.serialNumber = serialNumber;
    return this;
  }

  public withQualidadeImagens(
    qualidadeImagens: QualidadeImagens[],
  ): ReportQualidadeBuilder {
    this.perguntaParaQualidade.qualidadeImagens = qualidadeImagens;
    return this;
  }

  public withGate(gate: string): ReportQualidadeBuilder {
    this.perguntaParaQualidade.gate = gate;
    return this;
  }

  public withSeverTime(): this {
    this.perguntaParaQualidade.severTime = new Date();
    return this;
  }

  public withCodItem(codItem: string): ReportQualidadeBuilder {
    this.perguntaParaQualidade.codItem = codItem;
    return this;
  }

  public build(): ReportQualidade {
    return this.perguntaParaQualidade;
  }
}
