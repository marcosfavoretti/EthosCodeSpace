import { ImportaPedidoLogixUseCase } from '@app/modules/modules/planejador/application/ImportaPedidosLogix.usecase';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class ImportacaoPolling {
  constructor(
    @Inject(ImportaPedidoLogixUseCase)
    private importaPedidoLogixUseCase: ImportaPedidoLogixUseCase,
  ) {}

  @Interval(30000)
  async handleImportacaoPooling() {
    try {
      Logger.log('Iniciando importação de pedidos Logix...');
      await this.importaPedidoLogixUseCase.execute();
    } catch (error) {
      Logger.error(`falha na importação \n${error}`, ImportacaoPolling.name);
    }
  }
}
