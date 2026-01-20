import {
  AlocacaoComDependenciaProps,
  AlocacaoSemDependenciaProps,
  MetodoDeAlocacao,
} from '../abstract/MetodoDeAlocacao';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { IVerificaCapacidade } from '../interfaces/IVerificaCapacidade';
import { Pedido } from '../entities/Pedido.entity';
import { Fabrica } from '../entities/Fabrica.entity';
import { VerificaCapabilidade } from '../classes/VerificaCapabilidade';
import { IGerenciadorPlanejamentConsulta } from '../interfaces/IGerenciadorPlanejamentoConsulta';
import { ISelecionarItem } from '../interfaces/ISelecionarItem';
import { SelecionaItemDep } from '../classes/SelecionaItemDep';

export class AlocaItensDependencias extends MetodoDeAlocacao {
  constructor(
    gerenciador: IGerenciadorPlanejamentConsulta,
    readonly selecionador: ISelecionarItem = new SelecionaItemDep(),
  ) {
    super(gerenciador, selecionador);
  }

  verificacaoCapacidade(
    pedido: Pedido,
    codigoSetor: CODIGOSETOR,
  ): IVerificaCapacidade {
    return new VerificaCapabilidade(pedido.item, codigoSetor);
  }

  protected diasPossiveis(
    fabrica: Fabrica,
    pedido: Pedido,
    setor: CODIGOSETOR,
  ): Promise<Date[]> {
    throw new Error('NOT IMPLEMENTED');
  }

  protected alocacao(
    props: AlocacaoSemDependenciaProps,
  ): Promise<PlanejamentoTemporario[]> {
    throw new Error('NOT IMPLEMENTED');
  }

  protected async alocacaoComDependencia(
    props: AlocacaoComDependenciaProps,
  ): Promise<PlanejamentoTemporario[]> {
    let planejadosBase = props.planBase!.filter((p) => p.setor === props.setor);
    if (!planejadosBase.length && props.setor === CODIGOSETOR.PINTURAPO)
      planejadosBase = props.planBase!.filter(
        (p) => p.setor === CODIGOSETOR.PINTURALIQ,
      );
    const planejados: PlanejamentoTemporario[] = planejadosBase.map((p) => ({
      dia: p.dia,
      item: props.itemContext,
      pedido: p.pedido,
      qtd: p.qtd,
      setor: props.setor,
    }));

    return planejados;
  }
}
