import { Provider } from '@nestjs/common';
import { IOnNovoPlanejamentos } from './@core/interfaces/IOnNovoPlanejamento';
import { GerenciaDividaService } from './infra/service/GerenciaDivida.service';

export const OnNovoPlanejamento = Symbol('OnNovoPlanejamento');

export const OnNovoPlanejamentoProvider: Provider = {
  provide: OnNovoPlanejamento,
  useFactory: (
    tbProd: IOnNovoPlanejamentos,
    gDivida: IOnNovoPlanejamentos,
  ) => [],
  inject: [GerenciaDividaService],
};
