import { AdicionarNoExcelUseCase } from '@app/modules/modules/buffer/application/AdicionarNoExcel.usecase';
import { Controller, Inject, Post } from '@nestjs/common';

@Controller('/excel')
export class ExcelController {
  @Inject(AdicionarNoExcelUseCase)
  private adicionarNoExcelUseCase: AdicionarNoExcelUseCase;
  @Post('/')
  async compactBuffer2ExcelMethod(): Promise<void> {
    await this.adicionarNoExcelUseCase.run();
  }
}
