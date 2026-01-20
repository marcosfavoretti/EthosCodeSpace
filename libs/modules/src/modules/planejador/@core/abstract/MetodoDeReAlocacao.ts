import { Calendario } from "@app/modules/shared/classes/Calendario";
import { RealocacaoProps } from "../classes/RealocaacoProps";
import { RealocacaoParcial } from "../classes/RealocacaoParcial";
import { ItemComCapabilidade } from "../entities/Item.entity";
import { CODIGOSETOR } from "../enum/CodigoSetor.enum";
import { IGerenciadorPlanejamentConsulta } from "../interfaces/IGerenciadorPlanejamentoConsulta";
import { ISelecionarItem } from "../interfaces/ISelecionarItem";

export type HookRealocacaoProps = RealocacaoProps & {
  setor: CODIGOSETOR;
};

export type RealocacaoComDepedenciaProps = HookRealocacaoProps & {
  realocacaoUltSetor: RealocacaoParcial;
  itemContext: ItemComCapabilidade;
};

export type RealocacaoSemDependenciaProps = HookRealocacaoProps & {
  itemContext: ItemComCapabilidade;
};

export abstract class MetodoDeReAlocacao {
  protected calendario: Calendario = new Calendario();

  constructor(
    protected gerenciadorPlan: IGerenciadorPlanejamentConsulta,
    protected Itemselecionador: ISelecionarItem,
  ) {}

  protected abstract realocacao(
    props: RealocacaoSemDependenciaProps,
  ): Promise<RealocacaoParcial>;

  protected abstract realocacaoComDepedencia(
    props: RealocacaoComDepedenciaProps,
  ): Promise<RealocacaoParcial>;

  public async hookRealocacao(
    props: HookRealocacaoProps,
  ): Promise<RealocacaoParcial> {
    const itemContext = this.Itemselecionador.seleciona(props.estrutura);

    if (!itemContext) throw new Error('Não foi selecionado nenhuma item');

    if (
      props.realocacaoUltSetor &&
      (props.realocacaoUltSetor.adicionado.length ||
        props.realocacaoUltSetor.retirado.length)
    ) {
      return await this.realocacaoComDepedencia({
        ...props,
        itemContext,
        realocacaoUltSetor: props.realocacaoUltSetor || props.planFalho || [],
      });
    } else {
      return await this.realocacao({
        ...props,
        itemContext,
      });
    }
  }
}
