import { AdicionarNoExcelUseCase } from '@app/modules/modules/buffer/application/AdicionarNoExcel.usecase';
import { Controller, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('/excel')
export class ExcelController {
  @Inject(AdicionarNoExcelUseCase)
  private adicionarNoExcelUseCase: AdicionarNoExcelUseCase;
  @ApiResponse({
    status: 201,
    description: 'Processo de adição ao Excel iniciado com sucesso',
  })
  @Post('/')
  async compactBuffer2ExcelMethod(): Promise<void> {
    await this.adicionarNoExcelUseCase.run();
  }
}
