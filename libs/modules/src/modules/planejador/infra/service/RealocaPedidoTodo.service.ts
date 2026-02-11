import { differenceInBusinessDays, isAfter, isSameDay } from 'date-fns';
import { Injectable, Logger } from '@nestjs/common';
import {
  MetodoDeReAlocacao,
  RealocacaoComDepedenciaProps,
  RealocacaoSemDependenciaProps,
} from '../../@core/abstract/MetodoDeReAlocacao';
import { IGerenciadorPlanejamentConsulta } from '../../@core/interfaces/IGerenciadorPlanejamentoConsulta';
import { ISelecionarItem } from '../../@core/interfaces/ISelecionarItem';
import { PlanejamentoTemporario } from '../../@core/classes/PlanejamentoTemporario';
import { CODIGOSETOR } from '../../@core/enum/CodigoSetor.enum';
import { RealocacaoParcial } from '../../@core/classes/RealocacaoParcial';
import { VerificaCapabilidade } from '../../@core/classes/VerificaCapabilidade';
import type { IVerificaCapacidade } from '../../@core/interfaces/IVerificaCapacidade';

@Injectable()
export class RealocaPedidoTodoService extends MetodoDeReAlocacao {
  constructor(
    gerenciador: IGerenciadorPlanejamentConsulta,
    selecionarItem: ISelecionarItem,
    private metodoDeVerificacao: IVerificaCapacidade
  ) {
    super(gerenciador, selecionarItem);
  }


  /**
   * @param planejamentosDoPedido
   * @param dataEstopim
   * @param setor
   * @description filtra os planejamentos do setor em questao em que a data de estopim é maior ou igual
   * @returns
   */
  private planejamentosDoSetor(
    planejamentosDoPedido: PlanejamentoTemporario[],
    dataEstopim: Date,
    setor: CODIGOSETOR,
  ): PlanejamentoTemporario[] {
    return planejamentosDoPedido
      .filter(
        (p) =>
          p.setor === setor &&
          (isAfter(p.dia, dataEstopim) || isSameDay(p.dia, dataEstopim)),
      )
      .sort((a, b) => a.dia.getTime() - b.dia.getTime());
  }

  private calcOffSet(
    planejamentos: PlanejamentoTemporario[],
    dataEstopim: Date,
  ): number[] {
    return planejamentos.map((plan) =>
      differenceInBusinessDays(plan.dia, dataEstopim),
    );
  }

  protected async realocacao(
    props: RealocacaoSemDependenciaProps,
  ): Promise<RealocacaoParcial> {
    Logger.log(`REALOCACAO SEM DEP INIT ${props.setor}`);

    // props.

    const resultado: RealocacaoParcial = new RealocacaoParcial();

    const dataEstopim = props.planFalho.dia;

    //consigo pegar todo o planejamento do primeiro setor. Logo eles seram os inputs que vao realocar todos os proximos setores
    const planejamentosImpactadoDoSetorASC = this.planejamentosDoSetor(
      props.planDoPedido,
      props.planFalho.dia,
      props.setor,
    );

    Logger.log(
      'Planejamento do setor',
      planejamentosImpactadoDoSetorASC.map((a) => a.dia),
    );
    Logger.log('Planejamento do estopim', props.planFalho.dia);

    console.log(
      'planejamntos impact',
      planejamentosImpactadoDoSetorASC.reduce((t, a) => (t += a.qtd), 0),
    );

    for (const [
      index,
      planejamento,
    ] of planejamentosImpactadoDoSetorASC.entries()) {
      let totalParaRealocar = planejamento.qtd;

      if (totalParaRealocar <= 0) {
        console.log(
          `✅ Setor ${props.setor} finalizado. Pulando para o próximo da chain...`,
        );
        break; // passa para o próximo setor na chain
      }

      const novaData = props.novoDia;

      const datasParaAlocar =
        await this.gerenciadorPlan.diaParaAdiarProducaoEncaixe(
          novaData,
          props.setor,
          planejamento.item,
          totalParaRealocar,
          this.metodoDeVerificacao,
          props.planejamentoFabril,
          resultado.adicionado,
        );

      for (const [dataParaAlocar, _qtd] of datasParaAlocar.entries()) {
        const qtd = Math.min(
          _qtd,
          totalParaRealocar,
          planejamento.pedido.item.capabilidade(props.setor),
        );
        const planejamentoNovo: PlanejamentoTemporario = {
          ...planejamento,
          planejamentoSnapShotId: undefined,
          item: props.itemContext,
          dia: dataParaAlocar,
          qtd: qtd,
        };
        resultado.retirado.push(planejamento);
        resultado.adicionado.push(planejamentoNovo);
        totalParaRealocar -= qtd;
      }
    }
    console.log(
      'ficou adicionado',
      resultado.adicionado.map((a) => a.dia),
    );
    return resultado;
  }

  protected realocacaoComDepedencia(
    props: RealocacaoComDepedenciaProps,
  ): Promise<RealocacaoParcial> {
    throw new Error('Metodo nao foi pensado para alocacao com dependencia :(');
  }
}
