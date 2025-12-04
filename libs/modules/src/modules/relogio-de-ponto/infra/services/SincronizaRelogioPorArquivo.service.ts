import { parse } from 'date-fns';
import { ArquivoPontoDado } from '../../@core/class/ArquivoPontoDado.entity';
import { ISincronizadorDePontos } from '../../@core/interfaces/ISincronizadorDePontos';

export class SincronizaRelogioPorArquivoService
  implements ISincronizadorDePontos {
  arquivo = `
`;
  async sincroniza(): Promise<ArquivoPontoDado[]> {
    const dadosSincronizados = this.processaTexto({ data: this.arquivo });
    return dadosSincronizados;
  }

  private processaTexto(param: { data: string }): ArquivoPontoDado[] {
    const PIS_REGEX = /^\d{10}(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})\d(\d{11})/;
    const CPF_REGEX =
      /^\d{10}(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}):\d{2}-\d{5,}(\d{11})/;
    const linhas = param.data.split('\n');
    const resultados: ArquivoPontoDado[] = [];
    for (const linha of linhas) {
      // Otimização: pular linhas vazias ou curtas
      if (linha.length < 33) {
        continue;
      }
      let match = linha.match(PIS_REGEX);
      if (match) {
        const dataRaw = linha.slice(10, 18); // 8 chars: DDMMYYYY
        const horaRaw = linha.slice(18, 22); // 4 chars: HHmm
        // Monte a string na ordem da máscara: dd-MM-yyyy HH:mm
        const dataFormat = 'ddMMyyyy HHmm';
        const dataString = `${dataRaw} ${horaRaw}`; // Ex: "07/11/2025 01:14"
        const registro = new ArquivoPontoDado({
          tipoIdentificador: 'PIS',
          data: parse(dataString, dataFormat, new Date()), // Corrigido
          identificador: linha.slice(23, 34),
        });
        resultados.push(registro);
        continue;
      }
      // 5. TENTATIVA 2: Layout CPF
      match = linha.match(CPF_REGEX);
      if (match) {
        const dataRaw = linha.slice(10, 20);
        const horaRaw = linha.slice(21, 26);
        const dataString = `${dataRaw} ${horaRaw}`;
        const dataFormat = 'yyyy-MM-dd HH:mm';
        const registro = new ArquivoPontoDado({
          tipoIdentificador: 'CPF',
          data: parse(dataString, dataFormat, new Date()),
          identificador: linha.slice(35, 46),
        });
        resultados.push(registro);
        continue;
      }
    }
    return resultados;
  }
}
