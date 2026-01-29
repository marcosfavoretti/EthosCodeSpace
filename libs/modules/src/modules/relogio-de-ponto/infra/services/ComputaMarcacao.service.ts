import { IComputacaoPontos } from '../../@core/interfaces/IComputacaoPontos';
import { RegistroPonto } from '../../@core/entities/RegistroPonto.entity';
import { TipoMarcacaoPonto } from '../../@core/entities/TipoMarcacaoPonto.entity';
import { Injectable, Logger } from '@nestjs/common';
import { differenceInMinutes, hoursToMilliseconds } from 'date-fns';

/**
 * processa os pontos
 */
@Injectable()
export class ComputaMarcacaoService implements IComputacaoPontos {
  private readonly INTERVALO_CORTE: number = 9;

  async processar(props: {
    contextoMarcacao: TipoMarcacaoPonto[];
    pontos: RegistroPonto;
  }): Promise<Partial<TipoMarcacaoPonto>[]> {
    const listaMarcacao: Partial<TipoMarcacaoPonto>[] = [];
    const { pontos, contextoMarcacao } = props;

    let contadorSufixo = 0;

    const ultPonto = !contextoMarcacao.length ? undefined : contextoMarcacao[0];
    const ehNovo = this.ehNovoPeriodo(pontos, ultPonto?.registroPonto);
    contadorSufixo = ehNovo ? 0 : contextoMarcacao.length;
    listaMarcacao.push({
      registroPonto: pontos,
      marcacao: this.setSufixo(contadorSufixo++),
    });
    return listaMarcacao;
  }

  private setSufixo(contador: number): string {
    if (contador % 2 === 0) {
      return `${Math.floor(contador / 2) + 1}E`;
    }
    return `${Math.floor(contador / 2) + 1}S`;
  }

  private ehNovoPeriodo(
    ponto: RegistroPonto,
    ultimoPonto: RegistroPonto | undefined,
  ) {
    if (!ultimoPonto) return true;

    const corte_timer_millis = hoursToMilliseconds(this.INTERVALO_CORTE);

    console.log('-------------------------');
    console.log({ ultimoPonto, ponto, corte_timer_millis });
    console.log('-------------------------');

    const diff_millis =
      ponto.dataHoraAr.getTime() - ultimoPonto.dataHoraAr.getTime();

    return diff_millis > corte_timer_millis;
  }
}
