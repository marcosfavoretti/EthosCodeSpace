import { Inject } from '@nestjs/common';
import { ReportQualidadeBuilder } from '../../@core/builder/PerguntaParaQualidade.builder';
import { IQualidadeImagemRepository } from '../../@core/interfaces/IQualidadeImagemRepository';
import { IReportQualidadeRepository } from '../../@core/interfaces/perguntaParaQualidade.abstract';
import { GaleriaReportQualidadeDTO } from '@app/modules/contracts/dto/GaleriaReportQualidade.dto';
import { ReportQualidade } from '../../@core/entities/PerguntaParaQualidade.entity';

export class ReportQualidadeService {
  @Inject(IReportQualidadeRepository)
  private perguntaParaQualidadeRepo: IReportQualidadeRepository;
  @Inject(IQualidadeImagemRepository)
  private qualidadeImageRepo: IQualidadeImagemRepository;
  async create(
    dto: GaleriaReportQualidadeDTO,
    imagens: Array<Express.Multer.File>,
  ): Promise<ReportQualidade> {
    const pergunta = new ReportQualidadeBuilder()
      .withCodItem(dto.codItem)
      .withGate(dto.gate)
      .withSerialNumber(dto.nSerie)
      .withSeverTime()
      .build();
    const perguntaSalva = await this.perguntaParaQualidadeRepo.save(pergunta);
    perguntaSalva.qualidadeImagens = imagens.map((i) =>
      this.qualidadeImageRepo.create({ path: i.path }),
    );
    return this.perguntaParaQualidadeRepo.save(perguntaSalva);
  }
}
