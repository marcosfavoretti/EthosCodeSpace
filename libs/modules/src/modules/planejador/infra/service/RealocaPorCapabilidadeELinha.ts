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

export class RealocaPorCapabilidadeELinha extends MetodoDeReAlocacao {
  constructor(
    gerenciador: IGerenciadorPlanejamentConsulta,
    selecionarItem: ISelecionarItem,
  ) {
    super(gerenciador, selecionarItem);
  }

  protected async realocacao(
    props: RealocacaoSemDependenciaProps,
  ): Promise<RealocacaoParcial> {
    console.log(`REALOCACAO POR CAPABILIDADE E LINHA SEM DEP INIT ${props.setor}`);

    const resultado: RealocacaoParcial = new RealocacaoParcial();

    const planejamentosImpactadoDoSetorASC = [props.planFalho];

    for (const planejamento of planejamentosImpactadoDoSetorASC) {
      let totalParaRealocar = planejamento.qtd;

      if (totalParaRealocar <= 0) {
        break;
      }

      const novaData = props.novoDia;

      const datasParaAlocar =
        await this.gerenciadorPlan.diaParaAdiarProducaoEncaixe(
          novaData,
          props.setor,
          planejamento.item,
          totalParaRealocar,
          new VerificaLinhaCapabilidade(props.pedido.item, props.setor), // Utilizando VerificaLinhaCapabilidade
          props.planejamentoFabril,
          resultado.adicionado,
        );
        Logger.debug(`e agora ${datasParaAlocar}`)
      for (const [dataParaAlocar, _qtd] of datasParaAlocar.entries()) {
        const capacidadeItem = planejamento.pedido.item.capabilidade(props.setor); // Capacidade geral
        const qtdAlocada = Math.min(
          _qtd,
          totalParaRealocar,
          capacidadeItem, 
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

    const resultado = datasSelecionadas.reduce((total, a) => total + a.qtd, 0);

    return resultado - decrementador;
  }

  protected async realocacaoComDepedencia(
    props: RealocacaoComDepedenciaProps,
  ): Promise<RealocacaoParcial> {
    Logger.log(`====================================================`);
    Logger.log(`INICIANDO REALOCAÇÃO POR CAPABILIDADE E LINHA PARA O SETOR: ${props.setor}`);
    Logger.log(
      `Recebido do setor anterior (${props.realocacaoUltSetor.adicionado[0]?.setor || 'N/A'}):`,
    );
    Logger.log(
      `--> Datas ADICIONADAS pelo setor anterior: ${props.realocacaoUltSetor.adicionado.map((p) => p.dia)}`,
    );
    Logger.log(
      `--> Datas REMOVIDAS pelo setor anterior: ${props.realocacaoUltSetor.retirado.map((p) => p.dia)}`,
    );
    Logger.log(`====================================================`);

    const realocacaoParcial = new RealocacaoParcial();

    const ultimoSetor = props.realocacaoUltSetor.adicionado[0].setor;

    const planejamentosDoSetorAtual = props.planDoPedido
      .filter((plan) => plan.setor === props.setor)
      .sort((a, b) => a.dia.getTime() - b.dia.getTime());

    const planejamentoImpactados: PlanejamentoTemporario[] = [];
    let decrementador: number = 0;

    const planejamentoDoUltimoSetor = props.planDoPedido
      .filter(
        (plan) =>
          plan.setor === ultimoSetor &&
          !props.realocacaoUltSetor.retirado.some((r) =>
            isSameDay(r.dia, plan.dia),
          ),
      )
      .concat(props.realocacaoUltSetor.adicionado);

    for (const planejamento of planejamentosDoSetorAtual) {
      const quantoChega = this.quantoChegaDoUltimoSetorNaData(
        props.pedido.item,
        ultimoSetor,
        planejamentoDoUltimoSetor,
        planejamento.dia,
        decrementador,
      );

      if (quantoChega < planejamento.qtd) {
        planejamentoImpactados.push(planejamento);
        realocacaoParcial.retirado.push(planejamento);
        continue;
      }

      decrementador += planejamento.qtd;
    }

    for (const [
      index,
      planejamento,
    ] of props.realocacaoUltSetor.adicionado.entries()) {
      let totalParaRealocar = planejamento.qtd;

      if (totalParaRealocar <= 0) {
        break;
      }

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
          new VerificaLinhaCapabilidade(props.pedido.item, props.setor), // Utilizando VerificaLinhaCapabilidade
          props.planejamentoFabril,
          realocacaoParcial.adicionado,
        );

      for (const [dataParaAlocar, _qtd] of datasParaAlocar.entries()) {
        const capacidadeItem = planejamentoModificado.pedido.item.capabilidade(props.setor); // Capacidade geral
        const qtdAlocada = Math.min(
          _qtd,
          totalParaRealocar,
          capacidadeItem, // Considera a capacidade geral
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
    Logger.debug(`====================================================`);
    Logger.debug(`FINALIZANDO REALOCAÇÃO POR CAPABILIDADE E LINHA PARA O SETOR: ${props.setor}`);
    Logger.debug(
      `--> Itens que ESTE setor está REMOVENDO: ${realocacaoParcial.retirado.map((d) => d.dia)}`,
    );
    Logger.debug(
      `--> Itens que ESTE setor está ADICIONANDO: ${realocacaoParcial.adicionado.map((d) => `${d.qtd} em ${d.dia}`)}`,
    );
    Logger.debug(`====================================================`);
    return realocacaoParcial;
  }
}
