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
    if (ehNovo) {
      contadorSufixo = 0;
    } else {
      // If not a new period, continue the sequence from the last mark
      contadorSufixo = (ultPonto?.marcacao ? this.getContadorFromMarcacao(ultPonto.marcacao) : 0) + 1;
    }

    listaMarcacao.push({
      registroPonto: pontos,
      marcacao: this.setSufixo(contadorSufixo++),
    });
    return listaMarcacao;
  }

  private getContadorFromMarcacao(marcacao: string): number {
    const num = parseInt(marcacao.substring(0, marcacao.length - 1)); // Extract number part (e.g., '1' from '1E')
    const type = marcacao[marcacao.length - 1]; // Extract type part (e.g., 'E' or 'S')

    if (type === 'E') {
      return (num - 1) * 2;
    } else { // type === 'S'
      return (num - 1) * 2 + 1;
    }
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

    const diff_millis =
      ponto.dataHoraAr.getTime() - ultimoPonto.dataHoraAr.getTime();

    return diff_millis > corte_timer_millis;
  }
}
