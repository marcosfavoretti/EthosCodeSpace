import { Calendario } from '@app/modules/shared/classes/Calendario';
import { IGerenciadorPlanejamentConsulta } from '../../@core/interfaces/IGerenciadorPlanejamentoConsulta';
import { ISelecionarItem } from '../../@core/interfaces/ISelecionarItem';
import {
  MetodoDeReAlocacao,
  RealocacaoComDepedenciaProps,
  RealocacaoSemDependenciaProps,
} from '../../@core/abstract/MetodoDeReAlocacao';
import { RealocacaoParcial } from '../../@core/classes/RealocacaoParcial';

export class RealocaDependenciaService extends MetodoDeReAlocacao {
  constructor(
    gerenciador: IGerenciadorPlanejamentConsulta,
    public selecionador: ISelecionarItem,
  ) {
    super(gerenciador, selecionador);
  }

  protected async realocacao(
    props: RealocacaoSemDependenciaProps,
  ): Promise<RealocacaoParcial> {
    const resultado = new RealocacaoParcial();
    resultado.adicionado = [
      {
        ...props.planFalho,
        item: props.itemContext,
        dia: props.novoDia,
      },
    ];
    resultado.retirado = [props.planFalho];
    return resultado;
  }

  protected async realocacaoComDepedencia(
    props: RealocacaoComDepedenciaProps,
  ): Promise<RealocacaoParcial> {
    const resultado = new RealocacaoParcial();
    resultado.adicionado = [
      {
        ...props.planFalho,
        item: props.itemContext,
        dia: props.novoDia,
      },
    ];
    resultado.retirado = [props.planFalho];
    return resultado;
  }
}
