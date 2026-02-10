import { Logger } from '@nestjs/common';
import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { ItemComCapabilidade } from '../entities/Item.entity';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { IVerificaCapacidade } from '../interfaces/IVerificaCapacidade';

export class VerificaLinhaCapabilidade implements IVerificaCapacidade {
  constructor(
    private item: ItemComCapabilidade,
    private setor: CODIGOSETOR,
  ) {
    if (!item.getCodigo().match('-000-')) {
      throw new Error(
        'Só esperados itens 000 aqui. Pois só eles tem leadTimes',
      );
    }
  }

  calculaCapacidade(qtd: number): number {
    return this.item.capabilidade(this.setor) - qtd;
  }

  verificaCapacidade(qtd: number): boolean {
    return this.item.capabilidade(this.setor) >= qtd;
  }

  consumes(plan: PlanejamentoTemporario): boolean {
    Logger.debug(`VerificaLinhaCapabilidade - consumes: checking plan - ${this.item.linha} ${plan.item.linha}`);
    // Primeiro, garantimos que os objetos existem antes de tentar acessá-los.
    if (!plan || !plan.item) {
      // Adicionado log para depuração, caso o próprio 'plan' ou 'plan.item' seja o problema.
      Logger.warn(
        'PlanejamentoTemporario ou seu item é inválido.',
        'VerificaLinhaCapabilidade',
      );
      return false;
    }

    // A lógica original usava 'plan.pedido.item.linha', mas o resto do código
    // indica que deveríamos usar 'plan.item', que é o item do planejamento em si.
    const temLinha = 'linha' in plan.item;
    if (!temLinha) {
      return false;
    }

    // Agora que sabemos que 'plan.item' e 'this.item' são seguros, podemos logar.
    // O log foi movido para depois das validações para evitar erros.
    Logger.log(
      `Comparando linhas: [Planejamento: ${plan.item.linha}] vs [Estratégia: ${this.item.linha}]`,
      'VerificaLinhaCapabilidade',
    );

    return plan.item.linha === this.item.linha;
  }
}
