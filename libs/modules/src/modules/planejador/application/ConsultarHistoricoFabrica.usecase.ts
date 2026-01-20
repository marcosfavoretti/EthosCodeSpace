import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ComparaMudancaFabricaExecutorService } from '../@core/services/ComparaMudancaFabricaExecutor.service';
import { FabricaService } from '../infra/service/Fabrica.service';
import { ConsutlarFabricaDTO } from '@app/modules/contracts/dto/ConsultarFabrica.dto';
import { MudancasResDto } from '@app/modules/contracts/dto/MudancaRes.dto';
import { FalhaAoMapearMudancasException } from '../@core/exception/FalhaAoMapearMudancas.exception';

@Injectable()
export class ConsultarHistoricoFabricaUseCase {
  constructor(
    @Inject(FabricaService) private fabricaService: FabricaService,
    @Inject(ComparaMudancaFabricaExecutorService)
    private comparaMudancaFabricaExecutorService: ComparaMudancaFabricaExecutorService,
  ) { }

  async executaComparacao(dto: ConsutlarFabricaDTO): Promise<MudancasResDto[]> {
    try {
      const fabrica = await this.fabricaService.consultaFabrica(dto.fabricaId);
      const mudancas =
        await this.comparaMudancaFabricaExecutorService.compara(fabrica);
      return mudancas.map((mud) => MudancasResDto.fromClass(mud));
    } catch (error) {
      Logger.error(error);
      if(error instanceof FalhaAoMapearMudancasException){
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Falha ao consultar historico da fabrica')
    }
  }
}
