import { Injectable, Logger } from '@nestjs/common';
import { ISincronizadorDePontos } from '../../@core/interfaces/ISincronizadorDePontos';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ArquivoPontoDado } from '../../@core/class/ArquivoPontoDado.entity';
import { parse } from 'date-fns';

@Injectable()
export class SincronizaRelogioService implements ISincronizadorDePontos {
  private httpClient: Axios.AxiosInstance;

  setBaseUrl(props: { baseUrl: string }) {
    this.httpClient = axios.create({
      baseURL: props.baseUrl,

      withCredentials: true,
    });
  }

  constructor(private configService: ConfigService) {}

  async sincroniza(): Promise<ArquivoPontoDado[]> {
    const dayProcess = 1;
    const MonthProcess = new Date().getMonth()+1;//.getMonth vai de 0~11, somo mais um para normalizar entre 1~12
    const YearProcess = new Date().getFullYear();
    //
    const sessionToken = await this.loginNoRelogio();
    const geraArquivo = await this.geraArquivo({
      dayProcess,
      MonthProcess,
      YearProcess,
      session: sessionToken.token,
    });
    Logger.debug(`arquivo carregado do relogio ${new Date().toLocaleDateString()}`);

    const dadosSincronizados = this.processaTexto({ data: geraArquivo.data });

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
        console.log(registro.data)
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
        console.log(registro.data)
        continue;
      }
    }
    return resultados;
  }

  private async geraArquivo(param: {
    dayProcess: number;

    MonthProcess: number;

    YearProcess: number;

    session: string;
  }): Promise<{ data: string; path: string }> {
    const response = await this.httpClient.post<any>(
      '/get_afd.fcgi?mode=671',

      {
        initial_date: {
          day: param.dayProcess,

          month: param.MonthProcess,

          year: param.YearProcess,
        },

        session: param.session,
      },

      // { responseType: 'stream' }
    );

    // const writer = createWriteStream(`${randomUUID()}.txt`);

    // response.data.pipe(writer);

    // writer.on('finish', () => {

    // });

    // writer.on('error', (err) => {

    // console.error('Erro ao salvar o arquivo:', err);

    // });

    return {
      data: response.data,

      path: `//NONE`,
    };
  }

  private async loginNoRelogio(): Promise<{ token: string }> {
    try {
      const authProps = {
        login: this.configService.get<string>('RELOGIO_LOGIN'),

        password: this.configService.get<string>('RELOGIO_SENHA'),
      };

      const { data } = await this.httpClient.post<{ session: string }>(
        'login.fcgi',
        authProps,
      );

      const { session: token } = data;

      return { token };
    } catch (error) {
      console.error(error);

      throw new Error('Falha ao fazer login no relogio');
    }
  }
}
