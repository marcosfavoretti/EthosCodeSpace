import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TipoMarcacaoPontoRepository } from '../infra/repository/TipoMarcacaoPonto.repository';
import { ConsultaMarcacaoDTO } from '@app/modules/contracts/dto/ConsultaMarcacao.dto';
import { FindManyOptions, FindOptionsWhere, In, Raw } from 'typeorm';
import { ResponsePaginatorDTO } from '@app/modules/contracts/dto/ResponsePaginator.dto';
import { TipoMarcacaoPonto } from '../@core/entities/TipoMarcacaoPonto.entity';
import { RegistroPonto } from '../@core/entities/RegistroPonto.entity';
import { ResRegistroPontoTurnoPontoDTO } from '@app/modules/contracts/dto/ResRegistroPontoTurno.dto';
import { ResTipoMarcacaoDTO } from '@app/modules/contracts/dto/ResTipoMarcacao.dto';
import { addDays, isAfter, isBefore, isWithinInterval, parse, startOfDay, subHours } from 'date-fns';

@Injectable()
export class ConsultaMarcacaoPontosUseCase {
  private readonly logger = new Logger(ConsultaMarcacaoPontosUseCase.name);

  constructor(
    @Inject(TipoMarcacaoPontoRepository)
    private tipoMarcacaoPontoRepository: TipoMarcacaoPontoRepository,
  ) { }

  /**
   * Consulta marcações de ponto de forma flexível e paginada, suportando range de datas.
   * @param dto Contém os filtros de consulta e dados de paginação.
   * - `dataInicio`: Filtra a partir desta data (início do dia).
   * - `dataFim`: Filtra até esta data (fim do dia).
   * - `indetificador`: Filtra por 'mat', 'cpf', 'pis' ou 'nome' no registro de ponto.
   * - `page`: Página atual para paginação.
   * - `limit`: Número de itens por página.
   */
  async consulta(
    dto: ConsultaMarcacaoDTO,
  ): Promise<ResponsePaginatorDTO<ResRegistroPontoTurnoPontoDTO>> {
    try {
      // Agora desestruturamos apenas dataFim, dataInicio e indetificador
      let { dataFim, dataInicio, indetificador } = dto;
      indetificador = indetificador?.trim();
      //
      Logger.debug(dataFim, dataInicio)
      const page = dto.page ? +dto.page : 1;
      const limit = dto.limit ? +dto.limit : 10;
      const skip = (page - 1) * limit;

      const registroPontoQb = this.tipoMarcacaoPontoRepository.manager
        .createQueryBuilder(RegistroPonto, 'rp');

      // --- LÓGICA DE FILTRO POR RANGE DE DATAS ---
      let startFilterDate: Date | null = null;
      let endFilterDate: Date | null = null;

      if (dataInicio) {
        const parsedStart = this.parseDateString(dataInicio);
        if (parsedStart && !isNaN(parsedStart.getTime())) {
          // Define para 00:00:00.000 do dia inicial
          startFilterDate = new Date(parsedStart.setHours(0, 0, 0, 0));
        }
      }

      if (dataFim) {
        const parsedEnd = this.parseDateString(dataFim);
        if (parsedEnd && !isNaN(parsedEnd.getTime())) {
          // Define para 23:59:59.999 do dia final
          endFilterDate = new Date(parsedEnd.setHours(23, 59, 59, 999));
        }
      }
      Logger.debug(startFilterDate, endFilterDate)

      if (startFilterDate && endFilterDate) {
        // 1. Ambas as datas fornecidas: Checar se o início é maior que o fim
        if (startFilterDate.getTime() > endFilterDate.getTime()) {
          throw new BadRequestException('A data de início não pode ser posterior à data de fim.');
        }
        registroPontoQb.andWhere('rp.data BETWEEN :start AND :end', {
          start: startFilterDate,
          end: addDays(endFilterDate,1 ),
        });
        this.logger.debug(`Filtro de Data: ${startFilterDate.toISOString()} até ${endFilterDate.toISOString()}`);

      } else if (startFilterDate) {
        // 2. Somente dataInicio: Filtrar de 'start' em diante
        registroPontoQb.andWhere('rp.data >= :start', { start: startFilterDate });
        this.logger.debug(`Filtro de Data: A partir de ${startFilterDate.toISOString()}`);

      } else if (endFilterDate) {
        // 3. Somente dataFim: Filtrar até 'end'
        registroPontoQb.andWhere('rp.data <= :end', { end: addDays(endFilterDate,1 ) });
        this.logger.debug(`Filtro de Data: Até ${endFilterDate.toISOString()}`);
      }
      // --- FIM DA LÓGICA DE FILTRO POR RANGE DE DATAS ---

      if (indetificador) {
        registroPontoQb.andWhere(
          // Note o uso de parênteses para agrupar os ORs, isso é crucial!
          '(rp.mat = :id OR rp.cpf = :id OR rp.pis = :id OR UPPER(TRIM(rp.nome)) LIKE UPPER(:nomeBusca))',
          {
            id: indetificador,
            nomeBusca: `%${indetificador}%` // Adiciona os % aqui
          }
        );
      }

      // Clona a query para fazer a contagem total de dias distintos
      const totalQuery = registroPontoQb.clone().select('COUNT(DISTINCT rp.data)', 'count');
      const totalResult = await totalQuery.getRawOne();
      const total = parseInt(totalResult.count, 10) || 0;

      if (total === 0) {
        return {
          data: [],
          limit,
          page,
          total: 0,
          totalPages: 0,
        };
      }

      // Aplica paginação para buscar os dias
      const paginatedDaysQuery = registroPontoQb
        .select('DISTINCT rp.data', 'data')
        .orderBy('data', 'DESC')
        .offset(skip)
        .limit(limit);

      const distinctDaysResult = await paginatedDaysQuery.getRawMany();
      const daysToFetch = distinctDaysResult.map((r) => r.data);

      if (daysToFetch.length === 0) {
        return {
          data: [],
          limit,
          page,
          total,
          totalPages: Math.ceil(total / limit),
        };
      }

      // Busca todas as marcações para os dias paginados
      const whereClause: FindOptionsWhere<TipoMarcacaoPonto> = {};
      const whereRegistroBase: FindOptionsWhere<RegistroPonto> = {
        data: In(daysToFetch),
      };

      if (indetificador) {
        whereClause.registroPonto = [
          { ...whereRegistroBase, mat: indetificador },
          { ...whereRegistroBase, cpf: indetificador },
          { ...whereRegistroBase, pis: indetificador },
          {
            ...whereRegistroBase,
            nome: Raw((alias) => `UPPER(TRIM(${alias})) LIKE UPPER(:busca)`, {
              busca: `%${indetificador}%`
            })
          },
        ];
      } else {
        whereClause.registroPonto = whereRegistroBase;
      }

      const findOptions: FindManyOptions<TipoMarcacaoPonto> = {
        where: whereClause,
        relations: {
          registroPonto: true,
        },
        order: {
          registroPonto: {
            dataHoraAr: 'DESC',
          },
        },
      };

      const marcacoes = await this.tipoMarcacaoPontoRepository.find(findOptions);

      // O mapa agora agrupa por uma chave composta: 'diaDeTrabalho|idDoFuncionario'
      const marcacaoMapAux = new Map<string, TipoMarcacaoPonto[]>();
      const workdayCutoffHour = 5; // Define o horário de corte para o dia de trabalho (4 da manhã)

      for (const marcacao of marcacoes) {
        if (!marcacao.registroPonto) {
          this.logger.warn('Marcação encontrada sem RegistroPonto relacionado, ignorando.');
          continue;
        }

        const eventTime = marcacao.registroPonto.dataHoraAr;
        const employeeId = marcacao.registroPonto.mat;

        // Calcula o "dia de trabalho" com base no horário de corte
        const workdayDate = new Date(eventTime);
        /**somo 3 para fazer o balanceamento com o UTC */

        if (eventTime.getHours() < workdayCutoffHour) {
          workdayDate.setDate(workdayDate.getDate() - 1);
        }

        const workdayAdjusted = subHours(eventTime, 8);
        // Agora extraímos a string do dia (YYYY-MM-DD) dessa data ajustada
        // Usamos o toISOString().split('T')[0] para pegar a data "pura" resultante da subtração
        const workdayKey = workdayAdjusted.toISOString().split('T')[0];

        // Recria o objeto Date baseado na chave limpa (00:00:00)
        const workday = parse(workdayKey, 'yyyy-MM-dd', new Date());

        // ... restante da sua lógica de validação de range ...
        const workdayZero = startOfDay(workday);

        // 2. Validação do Início (Se existir startFilterDate)
        // "Se tenho data de início E o dia trabalhado é antes dela -> PULA"
        if (startFilterDate && isBefore(workdayZero, startFilterDate)) {
          continue;
        }

        // 3. Validação do Fim (Se existir endFilterDate)
        // "Se tenho data de fim E o dia trabalhado é depois dela -> PULA"
        // Nota: Aqui assumimos que endFilterDate já está setado para 23:59:59
        // OU comparamos startOfDay(workday) com startOfDay(endFilter)
        if (endFilterDate && isAfter(workdayZero, endFilterDate)) {
          continue;
        }

        const groupKey = `${workdayKey}|${employeeId}`;
        if (!marcacaoMapAux.has(groupKey)) {
          marcacaoMapAux.set(groupKey, []);
        }
        marcacaoMapAux.get(groupKey)!.push(marcacao);
      }

      const objetoRepostaMontado: ResRegistroPontoTurnoPontoDTO[] = Array.from(
        marcacaoMapAux.entries()
      ).map(([key, val]) => {
        const [workdayString] = key.split('|');
        const primeiroRegistro = val[0].registroPonto;
        const workday = parse(workdayString, 'yyyy-MM-dd', new Date());

        return {
          matricula: primeiroRegistro.mat,
          nome: primeiroRegistro.nome,
          turnoDiaStr: workday.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
          turnoDia: workday, // Data do dia de trabalho
          registros: val.sort((a, b) => a.registroPonto.dataHoraAr.getTime() - b.registroPonto.dataHoraAr.getTime()).map((v) => ({
            data: v.registroPonto.dataHoraAr,
            marcacao: v.marcacao,
            id: v.id,
            dataStr: v.registroPonto.dataHoraAr.toLocaleString('pt-BR')
          })) as ResTipoMarcacaoDTO[]
        } as ResRegistroPontoTurnoPontoDTO
      });

      // 5. Retornar Resposta Estruturada
      // ATENÇÃO: A paginação atual é baseada em dias, não em grupos de 'funcionário-dia'.
      // Isso significa que a contagem 'total' e o 'limit' podem não corresponder ao número de itens retornados.
      return {
        data: objetoRepostaMontado.sort((a, b) => {
          if (b.turnoDia.getTime() === a.turnoDia.getTime()) {
            return a.matricula.localeCompare(b.matricula);
          }
          return b.turnoDia.getTime() - a.turnoDia.getTime();
        }),
        limit: limit,
        page: page,
        total: total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Falha ao consultar marcações: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('A consulta falhou');
    }
  }

  /**
   * Helper para parsear strings de data nos formatos 'dd/MM/yyyy' ou 'dd-MM-yyyy'.
   * @param dateStr String da data a ser parseada.
   * @returns Objeto Date ou null se a string for inválida/vazia.
   */
  private parseDateString(dateStr: string): Date | null {
    if (!dateStr) return null;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return parse(dateStr, 'dd/MM/yyyy', new Date());
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      return parse(dateStr, 'dd-MM-yyyy', new Date());
    }
    //se o formato for yyyy-mm-dd
    else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return parse(dateStr, 'yyyy-MM-dd', new Date());
    }

    return null; // Retorna nulo se o formato não for reconhecido.
  }

}