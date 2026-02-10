import {
  AlocacaoComDependenciaProps,
  AlocacaoSemDependenciaProps,
  MetodoDeAlocacao,
} from '../abstract/MetodoDeAlocacao';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { subBusinessDays } from 'date-fns';
import { IGerenciadorPlanejamentConsulta } from '../interfaces/IGerenciadorPlanejamentoConsulta';
import { ISelecionarItem } from '../interfaces/ISelecionarItem';
import { Pedido } from '../entities/Pedido.entity';
import { IVerificaCapacidade } from '../interfaces/IVerificaCapacidade';
import { VerificaLinhaCapabilidade } from '../classes/VerificaLinhaCapabilidade';
import { Fabrica } from '../entities/Fabrica.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AlocaPorLinhaCapabilidade extends MetodoDeAlocacao {
  constructor(
    gerenciador: IGerenciadorPlanejamentConsulta,
    selecionador: ISelecionarItem,
  ) {
    super(gerenciador, selecionador);
  }

  private sortStrategy(): (a, b) => number {
    return (a, b) => b - a;
  }

  verificacaoCapacidade(
    pedido: Pedido,
    codigoSetor: CODIGOSETOR,
  ): IVerificaCapacidade {
    return new VerificaLinhaCapabilidade(pedido.item, codigoSetor);
  }

  protected async diasPossiveis(
    fabrica: Fabrica,
    pedido: Pedido,
    setor: CODIGOSETOR,
    planejamentoFabril: PlanejamentoTemporario[],
  ): Promise<Date[]> {
    try {
      const dias = await this.gerenciadorPlan.diaParaAdiantarProducaoEncaixe(
        pedido.getSafeDate(),
        setor,
        pedido.item,
        pedido.lote,
        this.verificacaoCapacidade(pedido, setor),
        planejamentoFabril,
      );
      return Array.from(dias.keys());
    } catch (error) {
      console.error(error);
      throw new Error(
        `Problema a consultar as datas para adiantar a producao\n${error}`,
      );
    }
  }

  protected async alocacaoComDependencia(
    props: AlocacaoComDependenciaProps,
  ): Promise<PlanejamentoTemporario[]> {
    const planejamentosTemporarios: PlanejamentoTemporario[] = [];
    const leadtime = props.pedido.getItem().getLeadtime(props.setor);
    const planejamentosProxOrdenados = props.planDoProximoSetor.sort(
      this.sortStrategy(),
    );
    let restante = props.pedido.getLote();

    for (const planejamento of planejamentosProxOrdenados) {
      if (restante <= 0) break;

      const precisoAlocar = planejamento.qtd;

      // calcula data limite considerando leadtime
      const dataLimite =
        leadtime > 0
          ? subBusinessDays(planejamento.dia, leadtime)
          : planejamento.dia;

      // gera as primeiras datas possíveis
      const fila = Array.from(
        (
          await this.gerenciadorPlan.diaParaAdiantarProducaoEncaixe(
            dataLimite,
            props.setor,
            props.itemContext,
            props.pedido.lote,
            this.verificacaoCapacidade(props.pedido, props.setor),
            props.planejamentoFabril,
            planejamentosTemporarios,
          )
        ).entries(),
      );
      
      // consome a fila até terminar o restante
      while (fila.length > 0 && restante > 0) {
        const [data, qtd] = fila.shift()!;
        
        Logger.debug(`resolve aqui ${data} ${props.setor}  ${restante},${qtd || Infinity},${props.pedido.item.capabilidade(props.setor)}`)

        const qtdParaAlocar = Math.min(
          restante,
          qtd || Infinity,
          props.pedido.item.capabilidade(props.setor),
        );

        if (qtdParaAlocar > 0) {
          planejamentosTemporarios.push({
            dia: data,
            item: props.itemContext,
            pedido: props.pedido,
            qtd: qtdParaAlocar,
            setor: props.setor,
          });
          restante -= qtdParaAlocar;
        }

        // fila acabou mas ainda falta -> busca mais datas
        if (fila.length === 0 && restante > 0) {
          const novasDatas =
            await this.gerenciadorPlan.diaParaAdiantarProducaoEncaixe(
              data,
              props.setor,
              props.itemContext,
              precisoAlocar, // usa qtd do próximo setor
              this.verificacaoCapacidade(props.pedido, props.setor),
              props.planejamentoFabril,
              planejamentosTemporarios,
            );
          fila.push(...novasDatas.entries());
        }
      }
    }

    return planejamentosTemporarios;
  }

  protected async alocacao(
    props: AlocacaoSemDependenciaProps,
  ): Promise<PlanejamentoTemporario[]> {
    try {
      const planejamentosDoPedido: PlanejamentoTemporario[] = [];
      let restante = props.pedido.getLote();
      // let i = 0;
      props.dias.sort((a, b) => b.getTime() - a.getTime());
      const diasXqtd =
        await this.gerenciadorPlan.diaParaAdiantarProducaoEncaixe(
          props.pedido.getSafeDate(),
          props.setor,
          props.pedido.item,
          props.pedido.lote,
          this.verificacaoCapacidade(props.pedido, props.setor),
          props.planejamentoFabril,
        );
      for (const [dia, qtd] of diasXqtd) {
        Logger.log(`resolve aqui ${restante}, ${qtd}`)
        const quantidadeParaAlocar = Math.min(restante, qtd);
        planejamentosDoPedido.push({
          dia: dia,
          item: props.itemContext,
          pedido: props.pedido,
          qtd: quantidadeParaAlocar,
          setor: props.setor,
        });
        restante -= quantidadeParaAlocar;
      }
      console.log('terminei alocacao');
      return planejamentosDoPedido;
    } catch (error) {
      console.error(error);
      throw new Error(`Erro ao alocar carga do pedido ${props.pedido.codigo}`);
    }
  }
}
