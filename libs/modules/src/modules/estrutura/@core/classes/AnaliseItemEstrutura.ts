import { Metricas } from '../interfaces/Metricas.abstract';
import { ItemEstrutura } from './ItemEstrutura';

export class AnaliseItemEstrutura {
  constructor(
    private _props: {
      item: ItemEstrutura;
      metrica: Metricas;
    },
  ) {}

  get props() {
    return structuredClone(this._props);
  }
}
