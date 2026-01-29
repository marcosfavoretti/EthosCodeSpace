import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ISincronizadorDePontos } from '../@core/interfaces/ISincronizadorDePontos';
import { ArquivoPontoDado } from '../@core/class/ArquivoPontoDado.entity';
import { FuncinarioRepository } from '../infra/repository/Funcionario.repository';
import { Between, Raw } from 'typeorm';
import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import { Funcionario } from '../@core/entities/Funcionarios.entity';
import { endOfDay, getHours, startOfDay, subMonths } from 'date-fns';
import { RegistroPontoRepository } from '../infra/repository/RegistroPonto.repository';
import { RegistroPonto } from '../@core/entities/RegistroPonto.entity';
import { SincronizadorFactory } from '../infra/services/SincronizadorFactory.service';

@Injectable()
export class SincronizaPontosUseCase {
  private sincronizador: ISincronizadorDePontos[];

  constructor(
    @Inject(FuncinarioRepository)
    private funcionarioRepository: FuncinarioRepository,
    @Inject(RegistroPontoRepository)
    private registroPontoRepository: RegistroPontoRepository,
    sincronizadorFactory: SincronizadorFactory,
  ) {
    this.sincronizador = sincronizadorFactory.createSincronizadores();
  }

  private genCustomKey(props: { identificador: string; dataInMillis: number }) {
    return `${props.identificador.trim()}-${props.dataInMillis}`;
  }

  async sincronizarPontos(): Promise<ResPontoRegistroDTO[]> {
    try {
      Logger.debug('SYNC PONTOS');
      const dadosSincronizados: ArquivoPontoDado[] = [];

      /**
       * dados que ainda nao foram processados
       */

      // const dadosPrecisandoDeMarcacao = await this.registroPontoRepository
      //   .find({
      //     where: {
      //       marcacao: IsNull()
      //     },
      //     relations: ['marcacao']
      //   })
      // console.log(dadosPrecisandoDeMarcacao)

      /**
       * pega do repositorio um range de dois mêses de
       * dados para assim ter certeza que o relogio nao vai dar a mais
       */
      const hoje = new Date();
      const dataFimBusca = endOfDay(hoje); // Hoje até 23:59:59
      const dataInicioBusca = startOfDay(subMonths(hoje, 2)); // 2 dias atrás desde 00:00:00
      const dbData = await this.registroPontoRepository.find({
        where: {
          dataHoraAr: Between(dataInicioBusca, dataFimBusca),
        },
      });

      /**
       * colocar em um mapa os registros para otimizar
       * consulta posteriors usando como chave identificador+millis ou cpf+millis
       */
      const dbDataMap = new Map<string, RegistroPonto>();
      for (const registro of dbData) {
        registro?.cpf &&
          dbDataMap.set(
            this.genCustomKey({
              identificador: registro.cpf,
              dataInMillis: registro.dataHoraAr.getTime(),
            }),
            registro,
          );
        registro?.pis &&
          dbDataMap.set(
            this.genCustomKey({
              identificador: registro.pis,
              dataInMillis: registro.dataHoraAr.getTime(),
            }),
            registro,
          );
      }

      /**
       * pega os dados sincronizados pelas estrategias
       */
      for (const sincronizadorService of this.sincronizador) {
        dadosSincronizados.push(...(await sincronizadorService.sincroniza()));
      }

      /**orderna para "agrupar" os semelhantes */
      const dadosOrdenadosPorIdentificador = dadosSincronizados.sort((a, b) =>
        a.identificador.localeCompare(b.identificador),
      );

      /**
       * filtrar pontos que eu ja tenho no banco
       */
      const dadosFiltrados = dadosOrdenadosPorIdentificador.filter((dado) => {
        const customKey = this.genCustomKey({
          identificador: dado.identificador,
          dataInMillis: dado.data.getTime(),
        });
        return !dbDataMap.has(customKey);
      });

      if (!dadosFiltrados.length) return [];

      const identificador = dadosFiltrados.map((dado) => dado.identificador);

      const identificadorUnico = Array.from([...new Set(identificador)]);

      /**
       * dados dos funcionarios para completar os objetos
       */
      const funcionarioData =
        await this.funcionarioRepository.buscarPoridentificador(
          identificadorUnico,
        );

      /**
       * mapear os funcionarios para mais para frente ele serem usados para completar a dto de resposta
       */
      const funcionarioMap = new Map<string, Funcionario>();

      for (const funcionario of funcionarioData) {
        funcionarioMap.set(funcionario.pis.trim(), funcionario);
        funcionarioMap.set(funcionario.cic.trim(), funcionario);
      }

      const dadosDeResposta: Partial<RegistroPonto>[] = dadosFiltrados.reduce(
        (acc, dado) => {
          const funcionario = funcionarioMap.get(dado.identificador);
          if (!funcionario) {
            Logger.warn(
              `Funcionário com identificador [${dado.identificador}] não encontrado. Ponto ignorado.`,
            );
            return acc;
          }
          acc.push({
            data: startOfDay(dado.data),
            pis: funcionario.pis.trim(),
            cpf: funcionario.cic.trim(),
            nome: funcionario.nome.trim(),
            mat: funcionario.matricula.trim(),
            dataHoraAr: dado.data,
            hora: getHours(dado.data).toString(),
            horaNumber: getHours(dado.data),
          } as Partial<RegistroPonto>);
          return acc;
        },
        [] as Partial<RegistroPonto>[],
      );

      Logger.log(dadosDeResposta);

      const dadosSalvos =
        await this.registroPontoRepository.save(dadosDeResposta);

      /**
       * construcao do objeto de resposta
       */

      return dadosSalvos;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Falha ao sincronizar pontos');
    }
  }
}
