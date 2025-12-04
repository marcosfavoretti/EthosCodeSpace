import { ExportEstruturaUsecase } from '@app/modules/modules/estrutura/application/ExportEstrutura.usecase';
import { EstruturaServiceModule } from '@app/modules/modules/estrutura/EstruturaService.module';
import { Controller, Inject, Post } from '@nestjs/common';

@Controller('export')
export class EstruturaExportController {
  // @Inject(ExportEstruturaUsecase) private exportEstruturaUseCase: ExportEstruturaUseCase;
  // @Post('/')
  // @UsePipes(new PartcodeValidationPipe())
  // public async exportToNeo4j(@Body() payload: GetEstruturaInputDTO): Promise<EstruturaDto> {
  //     return await this.exportEstruturaUseCase.export(new Partcode(payload.partcode));
  // }
}
