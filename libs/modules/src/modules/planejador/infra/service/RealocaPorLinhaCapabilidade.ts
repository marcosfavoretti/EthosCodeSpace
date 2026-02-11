import { Logger } from '@nestjs/common';
import {
  addBusinessDays,
  isBefore,
  isEqual,
  isSameDay,
  subBusinessDays,
} from 'date-fns';
import {
  MetodoDeReAlocacao,
  RealocacaoComDepedenciaProps,
  RealocacaoSemDependenciaProps,
} from '../../@core/abstract/MetodoDeReAlocacao';
import { IGerenciadorPlanejamentConsulta } from '../../@core/interfaces/IGerenciadorPlanejamentoConsulta';
import { ISelecionarItem } from '../../@core/interfaces/ISelecionarItem';
import { RealocacaoParcial } from '../../@core/classes/RealocacaoParcial';
import { PlanejamentoTemporario } from '../../@core/classes/PlanejamentoTemporario';
import { ItemComCapabilidade } from '../../@core/entities/Item.entity';
import { CODIGOSETOR } from '../../@core/enum/CodigoSetor.enum';
import { VerificaLinhaCapabilidade } from '../../@core/classes/VerificaLinhaCapabilidade';

export class RealocaPorLinhaCapabilidade extends MetodoDeReAlocacao {
  constructor(
    gerenciador: IGerenciadorPlanejamentConsulta,
    selecionarItem: ISelecionarItem,
  ) {
    super(gerenciador, selecionarItem);
  }

  protected async realocacao(
    props: RealocacaoSemDependenciaProps,
  ): Promise<RealocacaoParcial> {
    Logger.log(`REALOCACAO POR LINHA SEM DEP INIT ${props.setor}`);

    const resultado: RealocacaoParcial = new RealocacaoParcial();

    const planejamentosImpactadoDoSetorASC = [props.planFalho];

    for (const planejamento of planejamentosImpactadoDoSetorASC) {
      let totalParaRealocar = planejamento.qtd;

      if (totalParaRealocar <= 0) {
        break; // passa para o próximo setor na chain
      }

      const novaData = props.novoDia;

      const datasParaAlocar =
        await this.gerenciadorPlan.diaParaAdiarProducaoEncaixe(
          novaData,
          props.setor,
          planejamento.item,
          totalParaRealocar,
          new VerificaLinhaCapabilidade(props.pedido.item, props.setor),
          props.planejamentoFabril,
          resultado.adicionado,
        );

      for (const [dataParaAlocar, _qtd] of datasParaAlocar.entries()) {
        console.log(
          'debug',
          _qtd,
          totalParaRealocar,
          planejamento.pedido.item.capabilidade(props.setor),
        );
        const qtdAlocada = Math.min(
          _qtd,
          totalParaRealocar,
          planejamento.pedido.item.capabilidade(props.setor),
        );
        const planejamentoNovo: PlanejamentoTemporario = {
          ...planejamento,
          planejamentoSnapShotId: undefined,
          item: props.itemContext,
          dia: dataParaAlocar,
          qtd: qtdAlocada,
        };
        resultado.retirado.push(planejamento);
        resultado.adicionado.push(planejamentoNovo);
        totalParaRealocar -= qtdAlocada;
      }
    }

    return resultado;
  }

  private quantoChegaDoUltimoSetorNaData(
    item: ItemComCapabilidade,
    ultSetor: CODIGOSETOR,
    planUltSetor: PlanejamentoTemporario[],
    compareDate: Date,
    decrementador = 0,
  ): number {
    compareDate = subBusinessDays(compareDate, item.getLeadtime(ultSetor));

    const datasSelecionadas = planUltSetor.filter(
      (add) => isBefore(add.dia, compareDate) || isEqual(add.dia, compareDate),
    );

    console.log(
      `datas selecionadas ${datasSelecionadas.map((a) => a.dia)} para data ${compareDate}`,
    );

    const resultado = datasSelecionadas.reduce((total, a) => total + a.qtd, 0);

    console.log(resultado, 'QUANTO CHEGA');
    return resultado - decrementador;
  }

  protected async realocacaoComDepedencia(
    props: RealocacaoComDepedenciaProps,
  ): Promise<RealocacaoParcial> {
    console.log(`====================================================`);
    console.log(
      `INICIANDO REALOCAÇÃO POR LINHA PARA O SETOR: ${props.setor}`,
    );
    console.log(
      `Recebido do setor anterior (${props.realocacaoUltSetor.adicionado[0]?.setor || 'N/A'}):`,
    );
    console.log(
      `--> Datas ADICIONADAS pelo setor anterior: ${props.realocacaoUltSetor.adicionado.map((p) => p.dia)}`,
    );
    console.log(
      `--> Datas REMOVIDAS pelo setor anterior: ${props.realocacaoUltSetor.retirado.map((p) => p.dia)}`,
    );
    console.log(`====================================================`);

    const realocacaoParcial = new RealocacaoParcial();

    /**
     * seleciona so os planejamentos do setor atual
     */
    const ultimoSetor = props.realocacaoUltSetor.adicionado[0].setor;

    const planejamentosDoSetorAtual = props.planDoPedido
      .filter((plan) => plan.setor === props.setor)
      .sort((a, b) => a.dia.getTime() - b.dia.getTime());

    /**
     * seleciona os planejamentos que vao ser impactados pela realocacao do item
     */
    const planejamentoImpactados: PlanejamentoTemporario[] = [];
    let decrementador: number = 0;

    //filtro os dias do setor anterior e pego somente os dias que nao tiveram producao
    const planejamentoDoUltimoSetor = props.planDoPedido
      .filter(
        (plan) =>
          plan.setor === ultimoSetor &&
          !props.realocacaoUltSetor.retirado.some((r) =>
            isSameDay(r.dia, plan.dia),
          ),
      )
      .concat(props.realocacaoUltSetor.adicionado);

    console.log(props.realocacaoUltSetor.retirado.map((a) => a.dia));

    console.log(planejamentoDoUltimoSetor.map((a) => a.dia));

    for (const planejamento of planejamentosDoSetorAtual) {
      const quantoChega = this.quantoChegaDoUltimoSetorNaData(
        props.pedido.item,
        ultimoSetor,
        planejamentoDoUltimoSetor,
        planejamento.dia,
        decrementador,
      );
      console.log(
        `quanto chega ${props.setor} ${quantoChega}/${planejamento.qtd}`,
      );

      if (quantoChega < planejamento.qtd) {
        planejamentoImpactados.push(planejamento);
        realocacaoParcial.retirado.push(planejamento);
        console.log(`item adicionado ao retirados ${planejamento.dia}`);
        continue; //se ele vai ser replanejado nao vou consumir do decrementador
      }

      decrementador += planejamento.qtd;
    }

    //intero a lista com base na data de alocacao do ultimo setor
    for (const [
      index,
      planejamento,
    ] of props.realocacaoUltSetor.adicionado.entries()) {
      let totalParaRealocar = planejamento.qtd;

      if (totalParaRealocar <= 0) {
        break; // passa para o próximo setor na chain
      }

      //incrementa a data com base no leadtime do ultimo setor
      const novaData = addBusinessDays(
        planejamento.dia,
        props.pedido.item.getLeadtime(ultimoSetor),
      );

      const planejamentoModificado: PlanejamentoTemporario = {
        ...planejamento,
        setor: props.setor,
      };

      const datasParaAlocar =
        await this.gerenciadorPlan.diaParaAdiarProducaoEncaixe(
          novaData,
          props.setor,
          planejamentoModificado.item,
          totalParaRealocar,
          new VerificaLinhaCapabilidade(props.pedido.item, props.setor),
          props.planejamentoFabril,
          realocacaoParcial.adicionado,
        );

      for (const [dataParaAlocar, _qtd] of datasParaAlocar.entries()) {
        console.log(
          _qtd,
          totalParaRealocar,
          planejamentoModificado.pedido.item.capabilidade(props.setor),
        );
        const qtdAlocada = Math.min(
          _qtd,
          totalParaRealocar,
          planejamentoModificado.pedido.item.capabilidade(props.setor),
        );
        const planejamentoNovo: PlanejamentoTemporario = {
          ...planejamentoModificado,
          planejamentoSnapShotId: undefined,
          item: props.itemContext,
          dia: dataParaAlocar,
          qtd: qtdAlocada,
        };
        realocacaoParcial.adicionado.push(planejamentoNovo);
        totalParaRealocar -= qtdAlocada;
      }
    }
    console.debug(`====================================================`);
    console.debug(
      `FINALIZANDO REALOCAÇÃO POR LINHA PARA O SETOR: ${props.setor}`,
    );
    console.debug(
      `--> Itens que ESTE setor está REMOVENDO: ${realocacaoParcial.retirado.map((d) => d.dia)}`,
    );
    console.debug(
      `--> Itens que ESTE setor está ADICIONANDO: ${realocacaoParcial.adicionado.map((d) => `${d.qtd} em ${d.dia}`)}`,
    );
    console.debug(`====================================================`);
    return realocacaoParcial;
  }
}
