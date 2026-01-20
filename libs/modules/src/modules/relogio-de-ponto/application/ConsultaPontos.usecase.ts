import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TipoMarcacaoPontoRepository } from '../infra/repository/TipoMarcacaoPonto.repository';
import { ConsultaMarcacaoDTO } from '@app/modules/contracts/dto/ConsultaMarcacao.dto';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { ResponsePaginatorDTO } from '@app/modules/contracts/dto/ResponsePaginator.dto';
import { TipoMarcacaoPonto } from '../@core/entities/TipoMarcacaoPonto.entity';
import { RegistroPonto } from '../@core/entities/RegistroPonto.entity';
import { ResRegistroPontoTurnoPontoDTO } from '@app/modules/contracts/dto/ResRegistroPontoTurno.dto';
import { addDays, addHours, parse, startOfDay } from 'date-fns';
import { FuncinarioRepository } from '../infra/repository/Funcionario.repository';
import { Funcionario } from '../@core/entities/Funcionarios.entity';
import { ResTipoMarcacaoDTO } from '@app/modules/contracts/dto/ResTipoMarcacao.dto';
import { CheckInvalidHours } from '../@core/services/CheckInvalidHours';

@Injectable()
export class ConsultaMarcacaoPontosUseCase {
  private readonly logger = new Logger(ConsultaMarcacaoPontosUseCase.name);
  private readonly WORKDAY_CUTOFF_HOUR = 5;
  // Expressão Oracle para definir o "Dia do Turno" (Ex: batida as 03:00 do dia 15 conta como dia 14)
  private readonly ORACLE_SHIFT_DATE_EXPR = `TRUNC(rp.dataHoraAr - (5/24))`;

  constructor(
    private checkHorasIrregulares: CheckInvalidHours,
    private tipoMarcacaoPontoRepository: TipoMarcacaoPontoRepository,
    private funcionarioRepository: FuncinarioRepository,
  ) {}

  /**
   * Método Orquestrador Principal
   */
  async consulta(
    dto: ConsultaMarcacaoDTO,
  ): Promise<ResponsePaginatorDTO<ResRegistroPontoTurnoPontoDTO>> {
    try {
      // 1. Preparação dos Parâmetros
      const pagination = this.extractPaginationParams(dto);
      const dateRange = this.extractDateRangeParams(dto);

      // 2. Pré-filtro de Funcionários (se necessário)
      const matriculasFiltradas = await this.resolveEmployeeFilter(dto);
      if (matriculasFiltradas && matriculasFiltradas.length === 0) {
        return this.createEmptyResponse(pagination);
      }

      // 3. Construção da Query Base (Sem paginação, apenas filtros)
      const qbBase = this.createBaseQueryBuilder(
        matriculasFiltradas,
        dto,
        dateRange,
      );

      // 4. Contagem Total de Registros
      const total = await this.executeTotalCount(qbBase);
      if (total === 0) {
        return this.createEmptyResponse(pagination);
      }

      // 5. Busca das Chaves da Página Atual (Matrícula + Data do Turno)
      const pageKeys = await this.fetchPaginatedKeys(qbBase, pagination);
      if (!pageKeys.length) {
        return this.createEmptyResponse(pagination);
      }

      // 6. Hidratação dos Dados (Busca registros completos e mapeia para DTO)
      const fullRecords = await this.fetchFullDataByTimeRange(pageKeys);
      const responseData = await this.mapToResponseDTO(fullRecords);

      // 7. Retorno Final
      return {
        data: responseData,
        limit: pagination.limit,
        page: pagination.page,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`Erro consulta ponto: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Falha ao consultar pontos');
    }
  }

  // ===========================================================================
  // BLOCO 1: Preparação e Query Builder Base
  // ===========================================================================

  private extractPaginationParams(dto: ConsultaMarcacaoDTO) {
    const page = Math.max(1, Number(dto.page) || 1);
    const limit = Number(dto.limit) || 20;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }

  private extractDateRangeParams(dto: ConsultaMarcacaoDTO) {
    const { startFilterDate, endFilterDate } = this.parseDateRange(
      dto.dataInicio,
      dto.dataFim,
    );
    if (startFilterDate && endFilterDate && startFilterDate > endFilterDate) {
      throw new BadRequestException('Data início maior que data fim.');
    }
    return { start: startFilterDate, end: endFilterDate };
  }

  private createBaseQueryBuilder(
    matriculas: string[] | null,
    dto: ConsultaMarcacaoDTO,
    dateRange: { start: Date | null; end: Date | null },
  ): SelectQueryBuilder<RegistroPonto> {
    const qb = this.tipoMarcacaoPontoRepository.manager
      .createQueryBuilder(RegistroPonto, 'rp') // 'rp' é a PIXIE_ARQUIVO_AFD

      // --- ADICIONADO O JOIN AQUI ---
      // 1º arg: Nome da tabela ou Entidade ('PIXIE_ARQUIVO_AFD_MARCACAO')
      // 2º arg: Alias ('m')
      // 3º arg: A condição ON ('rp.id = m.REGISTROID')
      .innerJoin('PIXIE_ARQUIVO_AFD_MARCACAO', 'm', 'rp.id = m.REGISTROID')
      // ------------------------------

      .select('rp.mat', 'matricula')
      .addSelect(this.ORACLE_SHIFT_DATE_EXPR, 'dataturno') // Garanta que a string SQL do TRUNC está nessa const
      .distinct(true);

    this.applyFilters(qb, matriculas, dto, dateRange.start, dateRange.end);
    return qb;
  }

  // ===========================================================================
  // BLOCO 2: Execução de Queries (Count e Paginação)
  // ===========================================================================

  /**
   * Executa a contagem total de dias de trabalho (grupos únicos de Matrícula + DataTurno).
   * Usa SQL puro encapsulado para evitar que o TypeORM injete IDs indesejados.
   */
  private async executeTotalCount(
    qbBase: SelectQueryBuilder<RegistroPonto>,
  ): Promise<number> {
    const qbCount = qbBase.clone().orderBy(); // Remove ordenação para performance
    const [sqlQuery, sqlParams] = qbCount.getQueryAndParameters();

    // Envolve a query DISTINCT em um COUNT externo
    Logger.debug(sqlQuery);
    const countResult = await this.tipoMarcacaoPontoRepository.manager.query(
      `SELECT COUNT(1) AS "total" FROM (${sqlQuery})`,
      sqlParams,
    );

    const rawTotal = countResult[0]
      ? countResult[0].total || countResult[0].TOTAL
      : 0;
    return parseInt(String(rawTotal), 10);
  }

  /**
   * Busca apenas as chaves (Matricula e Data) da página solicitada.
   */
  private async fetchPaginatedKeys(
    qbBase: SelectQueryBuilder<RegistroPonto>,
    pagination: { skip: number; limit: number },
  ): Promise<{ matricula: string; dataturno: Date }[]> {
    return qbBase
      .orderBy(this.ORACLE_SHIFT_DATE_EXPR, 'DESC') // Ordena por Data Calculada
      .addOrderBy('rp.mat', 'ASC') // Desempate por Matrícula
      .offset(pagination.skip)
      .limit(pagination.limit)
      .getRawMany<{ matricula: string; dataturno: Date }>();
  }

  // ===========================================================================
  // BLOCO 3: Filtros e Lógica de Negócio (WHERE)
  // ===========================================================================

  private async resolveEmployeeFilter(
    dto: ConsultaMarcacaoDTO,
  ): Promise<string[] | null> {
    if (!dto.ccid && !dto.indetificador) return null;
    return this.getMatriculasFilter(dto);
  }

  private applyFilters(
    qb: SelectQueryBuilder<RegistroPonto>,
    matriculasFiltradas: string[] | null,
    dto: ConsultaMarcacaoDTO,
    startFilterDate: Date | null,
    endFilterDate: Date | null,
  ) {
    // 1. Filtro de Lista de Matrículas (Chunking para evitar ORA-01795)
    if (matriculasFiltradas && matriculasFiltradas.length > 0) {
      if (matriculasFiltradas.length > 1000) {
        qb.andWhere('rp.mat IN (:...mats)', {
          mats: matriculasFiltradas.slice(0, 1000),
        });
      } else {
        qb.andWhere('rp.mat IN (:...mats)', { mats: matriculasFiltradas });
      }
    }
    // 2. Filtro Genérico por Identificador (Nome, CPF, PIS, Matrícula unitária)
    else if (dto.indetificador?.trim()) {
      const term = dto.indetificador.trim();
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('rp.mat = :id', { id: term })
            .orWhere('rp.cpf = :id', { id: term })
            .orWhere('rp.pis = :id', { id: term });
        }),
      );
    }

    // 3. Filtros de Data (Performance Index + Lógica de Negócio)
    if (startFilterDate) {
      qb.andWhere('rp.data >= :idxStart', { idxStart: startFilterDate });
      qb.andWhere(`${this.ORACLE_SHIFT_DATE_EXPR} >= :realStart`, {
        realStart: startFilterDate,
      });
    }
    if (endFilterDate) {
      qb.andWhere('rp.data <= :idxEnd', { idxEnd: addDays(endFilterDate, 2) });
      qb.andWhere(`${this.ORACLE_SHIFT_DATE_EXPR} <= :realEnd`, {
        realEnd: endFilterDate,
      });
    }
  }

  // ===========================================================================
  // BLOCO 4: Hidratação de Dados e Mapping (DTOs)
  // ===========================================================================

  private async fetchFullDataByTimeRange(
    keys: { matricula: string; dataturno: Date }[],
  ): Promise<TipoMarcacaoPonto[]> {
    if (!keys.length) return [];

    const qb = this.tipoMarcacaoPontoRepository
      .createQueryBuilder('tmp')
      .innerJoinAndSelect('tmp.registroPonto', 'rp')
      .where(
        new Brackets((qbWhere) => {
          keys.forEach((key, index) => {
            const baseDate = new Date(key.dataturno);
            // Recria a janela de 24h exata do turno (05:00 D até 05:00 D+1)
            const startWindow = addHours(
              startOfDay(baseDate),
              this.WORKDAY_CUTOFF_HOUR,
            );
            const endWindow = addDays(startWindow, 1);

            const paramMat = `mat_${index}`;
            const paramStart = `start_${index}`;
            const paramEnd = `end_${index}`;

            qbWhere.orWhere(
              `(rp.mat = :${paramMat} AND rp.dataHoraAr >= :${paramStart} AND rp.dataHoraAr < :${paramEnd})`,
              {
                [paramMat]: key.matricula,
                [paramStart]: startWindow,
                [paramEnd]: endWindow,
              },
            );
          });
        }),
      )
      .orderBy('rp.dataHoraAr', 'ASC');

    return qb.getMany();
  }

  private async mapToResponseDTO(
    marcacoes: TipoMarcacaoPonto[],
  ): Promise<ResRegistroPontoTurnoPontoDTO[]> {
    const marcacaoMap = new Map<string, TipoMarcacaoPonto[]>();
    const matriculasUnicas = new Set<string>();

    // Ordenação inicial
    marcacoes.sort(
      (a, b) =>
        a.registroPonto.dataHoraAr.getTime() -
        b.registroPonto.dataHoraAr.getTime(),
    );

    // Agrupamento em Memória
    for (const item of marcacoes) {
      if (!item.registroPonto) continue;
      const { mat, dataHoraAr } = item.registroPonto;

      let workdayDate = this.calculateWorkdayDate(dataHoraAr, item.marcacao);

      // Tratamento de órfãos (batida solta que pertence ao dia anterior)
      let groupKey = this.generateGroupKey(mat, workdayDate);
      if (!item.marcacao.endsWith('1E') && !marcacaoMap.has(groupKey)) {
        workdayDate = addDays(workdayDate, -1);
        groupKey = this.generateGroupKey(mat, workdayDate);
      }

      if (!marcacaoMap.has(groupKey)) marcacaoMap.set(groupKey, []);
      marcacaoMap.get(groupKey)!.push(item);
      matriculasUnicas.add(mat);
    }

    // Busca dados complementares (Nome, Setor)
    const funcionariosDict = await this.fetchEmployeeDetails(
      Array.from(matriculasUnicas),
    );

    // Construção do Resultado
    const result: ResRegistroPontoTurnoPontoDTO[] = [];
    for (const [key, lista] of marcacaoMap.entries()) {
      if (!lista.length) continue;
      const dto = this.buildSingleDto(key, lista, funcionariosDict);
      result.push(dto);
    }

    return this.sortFinalResult(result);
  }

  private buildSingleDto(
    groupKey: string,
    lista: TipoMarcacaoPonto[],
    funcionariosDict: Record<string, Funcionario>,
  ): ResRegistroPontoTurnoPontoDTO {
    const header = lista[0].registroPonto;
    const datePart = groupKey.split('|')[1];
    const turnoDia = new Date(datePart);

    const funcionario = funcionariosDict[header.mat];
    const setorDesc = funcionario?.centroDeCusto?.descricao || 'N/A';
    const nomeFunc = funcionario?.nome || header.nome || 'Desconhecido';

    const registrosDePonto = lista.map((m) => ({
      id: m.id,
      data: m.registroPonto.dataHoraAr,
      dataStr: m.registroPonto.dataHoraAr.toLocaleString('pt-BR'),
      marcacao: m.marcacao,
    }));

    const horasTrabalhadas = this.deltaHours(registrosDePonto);

    return {
      matricula: header.mat.trim(),
      nome: nomeFunc.trim(),
      horasIrregulares: this.checkHorasIrregulares.checkInvalidHours({
        workedhours: horasTrabalhadas,
      }),
      qtdHoras: horasTrabalhadas,
      setor: setorDesc.trim(),
      turnoDiaStr: turnoDia.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      turnoDia: turnoDia,
      registros: registrosDePonto,
    };
  }

  // ===========================================================================
  // BLOCO 5: Helpers Utilitários (Cálculos de Hora e Data)
  // ===========================================================================

  private calculateWorkdayDate(eventTime: Date, tipoMarcacao: string): Date {
    let workdayDate = startOfDay(eventTime);
    // Se for antes das 05:00 e não for a primeira entrada, pertence tecnicamente ao dia anterior
    if (
      eventTime.getHours() < this.WORKDAY_CUTOFF_HOUR &&
      !tipoMarcacao.endsWith('1E')
    ) {
      workdayDate = addDays(workdayDate, -1);
    }
    return workdayDate;
  }

  private generateGroupKey(matricula: string, date: Date): string {
    return `${matricula}|${date.toISOString()}`;
  }

  private deltaHours(registros: ResTipoMarcacaoDTO[]): number {
    const registrosOrdenados = [...registros].sort(
      (a, b) => a.data.getTime() - b.data.getTime(),
    );
    let msTrabalhados = 0;
    let entradaAtual: Date | null = null;
    let pares = 0;

    for (const reg of registrosOrdenados) {
      if (reg.marcacao.endsWith('E') && !entradaAtual) {
        entradaAtual = reg.data;
      } else if (reg.marcacao.endsWith('S') && entradaAtual) {
        msTrabalhados += reg.data.getTime() - entradaAtual.getTime();
        entradaAtual = null;
        pares++;
      }
    }

    let horas = msTrabalhados / (1000 * 60 * 60);
    // Desconto de 1h de almoço se trabalhou > 6h e tem apenas 1 par (regra de negócio específica)
    if (pares === 1 && horas > 6) horas -= 1;

    return Math.max(0, horas);
  }

  private sortFinalResult(data: ResRegistroPontoTurnoPontoDTO[]) {
    return data.sort((a, b) => {
      const timeDiff = b.turnoDia.getTime() - a.turnoDia.getTime();
      return timeDiff !== 0 ? timeDiff : a.matricula.localeCompare(b.matricula);
    });
  }

  // ===========================================================================
  // BLOCO 6: Repositórios Auxiliares e Parsing
  // ===========================================================================

  private async getMatriculasFilter(
    dto: ConsultaMarcacaoDTO,
  ): Promise<string[] | null> {
    const qb = this.funcionarioRepository
      .createQueryBuilder('f')
      .select('f.matricula');
    let applied = false;

    if (dto.ccid) {
      qb.innerJoin('f.centroDeCusto', 'cc').andWhere(
        'TRIM(f.RA_CC) = TRIM(:cc)',
        { cc: dto.ccid },
      );
      applied = true;
    }

    if (dto.indetificador && isNaN(Number(dto.indetificador.trim()))) {
      const term = dto.indetificador.trim();
      qb.andWhere('UPPER(TRIM(f.nome)) LIKE UPPER(:nome)', {
        nome: `%${term}%`,
      }).andWhere('f.demitido != :demitido', { demitido: 'D' });
      applied = true;
    }

    if (!applied) return null;
    const result = await qb.getMany();
    return result.map((f) => f.matricula.trim());
  }

  private async fetchEmployeeDetails(
    matriculas: string[],
  ): Promise<Record<string, Funcionario>> {
    if (!matriculas.length) return {};
    const lista =
      await this.funcionarioRepository.buscarPoridentificador(matriculas);
    const mapa: Record<string, Funcionario> = {};
    for (const f of lista) mapa[f.matricula.trim()] = f;
    return mapa;
  }

  private parseDateRange(startStr?: string, endStr?: string) {
    const pStart = this.parseDateString(startStr);
    const pEnd = this.parseDateString(endStr);
    return {
      startFilterDate: pStart ? startOfDay(pStart) : null,
      endFilterDate: pEnd ? new Date(pEnd.setHours(23, 59, 59, 999)) : null,
    };
  }

  private parseDateString(dateStr?: string): Date | null {
    if (!dateStr) return null;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr))
      return parse(dateStr, 'dd/MM/yyyy', new Date());
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
      return parse(dateStr, 'yyyy-MM-dd', new Date());
    return null;
  }

  private createEmptyResponse(pagination: {
    page: number;
    limit: number;
  }): ResponsePaginatorDTO<ResRegistroPontoTurnoPontoDTO> {
    return {
      data: [],
      limit: pagination.limit,
      page: pagination.page,
      total: 0,
      totalPages: 0,
    };
  }
}
