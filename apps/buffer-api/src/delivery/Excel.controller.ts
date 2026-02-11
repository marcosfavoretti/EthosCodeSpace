import { AdicionarNoExcelUseCase } from '@app/modules/modules/buffer/application/AdicionarNoExcel.usecase';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';
import { Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
@Roles(CargoEnum.PCP, CargoEnum.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
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
