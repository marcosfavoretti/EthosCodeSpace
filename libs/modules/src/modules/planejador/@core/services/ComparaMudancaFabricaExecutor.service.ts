import { Inject, Injectable, Logger } from '@nestjs/common';
import { IComparaMudancasFabrica } from '../interfaces/IComparaMudancasFabricas';
import { Mudancas } from '../classes/Mudancas';
import { Fabrica } from '../entities/Fabrica.entity';
import { FalhaAoMapearMudancasException } from '../exception/FalhaAoMapearMudancas.exception';
import { MudancaFabricaEstrategias } from '../../MudancaFabrica.provider';

@Injectable()
export class ComparaMudancaFabricaExecutorService {
  @Inject(MudancaFabricaEstrategias)
  private estrategiasComparacao: IComparaMudancasFabrica[] = [];

  async compara(fabricaAlvo: Fabrica): Promise<Mudancas[]> {
    try {
      const fabricaPai = fabricaAlvo.fabricaPai;
      if (!fabricaPai) return [];
      const estrategiasResolvedPromises = await Promise.all(
        this.estrategiasComparacao.map((e) =>
          e.compara(fabricaAlvo, fabricaPai),
        ),
      );
      return estrategiasResolvedPromises.flat();
    } 
    catch (error) {
      Logger.error(error);
      throw new FalhaAoMapearMudancasException(fabricaAlvo);
    }
  }
}
