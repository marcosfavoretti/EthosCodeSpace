import { Calendario } from '@app/modules/shared/classes/Calendario';
import { AlocacaoProps } from '../classes/AlocacaoProps';
import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { Fabrica } from '../entities/Fabrica.entity';
import { ItemComCapabilidade } from '../entities/Item.entity';
import { Pedido } from '../entities/Pedido.entity';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { IGerenciadorPlanejamentConsulta } from '../interfaces/IGerenciadorPlanejamentoConsulta';
import { ISelecionarItem } from '../interfaces/ISelecionarItem';
import { IVerificaCapacidade } from '../interfaces/IVerificaCapacidade';

export type HookAlocacaoProps = AlocacaoProps & {
  setor: CODIGOSETOR;
  planDoProximoSetor?: PlanejamentoTemporario[];
};

export type AlocacaoComDependenciaProps = HookAlocacaoProps & {
  planDoProximoSetor: PlanejamentoTemporario[];
  itemContext: ItemComCapabilidade;
};

export type AlocacaoSemDependenciaProps = HookAlocacaoProps & {
  fabrica: Fabrica;
  pedido: Pedido;
  setor: CODIGOSETOR;
  dias: Date[];
  itemContext: ItemComCapabilidade;
};

export abstract class MetodoDeAlocacao {
  protected calendario: Calendario = new Calendario();

  constructor(
    protected gerenciadorPlan: IGerenciadorPlanejamentConsulta,
    protected Itemselecionador: ISelecionarItem,
  ) {}


  protected abstract alocacao(
    props: AlocacaoSemDependenciaProps,
  ): Promise<PlanejamentoTemporario[]>;

  protected abstract alocacaoComDependencia(
    props: AlocacaoComDependenciaProps,
  ): Promise<PlanejamentoTemporario[]>;

  abstract verificacaoCapacidade(
    pedido: Pedido,
    codigoSetor: CODIGOSETOR,
  ): IVerificaCapacidade;

  public async hookAlocacao(
    props: HookAlocacaoProps,
  ): Promise<PlanejamentoTemporario[]> {
    const itemContext = this.Itemselecionador.seleciona(props.estrutura);
    if (!itemContext) throw new Error('Não foi selecionado nenhuma item');
    const planejamento: PlanejamentoTemporario[] = [];
    if (
      (props.planDoProximoSetor && props.planDoProximoSetor.length) ||
      (props.planBase && props.planBase.length)
    ) {
      // const alocacao = await this.alocacaoComDependencia(props.fabrica, props.pedido, props.setor, props.planDoProximoSetor);
      const alocacao = await this.alocacaoComDependencia({
        ...props,
        itemContext,
        planDoProximoSetor: props.planDoProximoSetor || props.planBase || [],
      });
      planejamento.push(...alocacao);
    } else {
      // const diasDoSetor = await this.diasPossiveis(props.fabrica, props.pedido, props.setor, props.planejamentoFabril);
      const alocacao = await this.alocacao({
        ...props,
        dias: [], //todo tirar isso aqui plmd
        fabrica: props.fabrica,
        pedido: props.pedido,
        setor: props.setor,
        itemContext,
      });
      planejamento.push(...alocacao);
    }
    return planejamento;
  }
}
