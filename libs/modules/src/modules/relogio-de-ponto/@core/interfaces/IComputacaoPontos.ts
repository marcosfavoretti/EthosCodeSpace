import { RegistroPonto } from '../entities/RegistroPonto.entity';
import { TipoMarcacaoPonto } from '../entities/TipoMarcacaoPonto.entity';

export interface IComputacaoPontos {
  processar(props: {
    pontos: RegistroPonto;
    contextoMarcacao: TipoMarcacaoPonto[];
  }): Promise<Partial<TipoMarcacaoPonto>[]>;
}
