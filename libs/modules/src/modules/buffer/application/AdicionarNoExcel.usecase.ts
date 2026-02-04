import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { CompactBufferDataService } from '../infra/service/CompactBufferData.service';
import { ExcelService } from '../infra/service/Excel.service';
import { IStorageService } from '../../storage/@core/interfaces/IStorage.service';
import { ConfigService } from '@nestjs/config';

export class AdicionarNoExcelUseCase {
  private readonly logger: Logger = new Logger();
  private readonly sheetTarget = 'DADOS';
  private readonly excelFile: string | undefined;

  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(IStorageService) private readonly storageService: IStorageService,
    @Inject(CompactBufferDataService)
    private readonly compactBufferDataService: CompactBufferDataService,
    @Inject(ExcelService) private readonly excelService: ExcelService,
  ) {
    this.excelFile = this.configService.get<string>('EXCELFILE');
    this.logger.debug(`Excel file: ${this.excelFile}`);
    if (!this.excelFile) throw new Error('necessario caminho para o excel');
  }

  async run(): Promise<void> {
    const filename = this.excelFile!;
    try {
      const today = new Date();
      const data = await this.compactBufferDataService.compact(
        startOfDay(today),
        endOfDay(today),
      );

      if (!data.length) throw new Error('Sem dados para sincronizar');

      // 1. CORREÇÃO AQUI: Use .map para criar um novo array corrigido
      const fixedData = data.map((d) => {
        const originalDate = new Date(d.serverTime);
        // O ExcelJS grava o valor UTC. Se o horário for 00:00 BRT (03:00 UTC), o Excel mostrará 03:00.
        // Forçamos o UTC para 00:00 para exibir corretamente no Excel.
        originalDate.setUTCHours(0, 0, 0, 0);
        return {
          ...d,
          serverTime: originalDate,
        };
      });

      const excelBuffer = await this.storageService.get('', filename);

      console.log(fixedData[0]);

      const workBook = await this.excelService.openWorkBook(excelBuffer);

      this.excelService.removeRowsByDate(
        workBook,
        this.sheetTarget,
        1,
        new Date(fixedData[0].serverTime),
      );

      // 3. USE fixedData AQUI
      this.excelService.appendDataToEnd(
        workBook,
        fixedData,
        this.sheetTarget,
      );

      const outputBuffer = await this.excelService.getWorkbookBuffer(workBook);
      console.log(outputBuffer);
      await this.storageService.save('', filename, outputBuffer, true);
      this.logger.debug(`Dados salvos em: ${this.excelFile}`);
    } catch (error) {
      console.error(error);
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
