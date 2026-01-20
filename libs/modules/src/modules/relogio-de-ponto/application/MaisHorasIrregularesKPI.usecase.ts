import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConsultaMarcacaoPontosUseCase } from "./ConsultaPontos.usecase";
import { endOfMonth, startOfMonth } from "date-fns";
import { formatyyyy_MM_dd } from "@app/modules/utils/datefns.wrapper";
import { ResRegistroPontoTurnoPontoDTO } from "@app/modules/contracts/dto/ResRegistroPontoTurno.dto";
import { ResHorasIrregularesDTO } from "@app/modules/contracts/dto/ResHorasIrregulares.dto";
import { CheckInvalidHours } from "../@core/services/CheckInvalidHours";
import { ConsultaMarcacaoDTO } from "@app/modules/contracts/dto/ConsultaMarcacao.dto";

@Injectable()
export class MaisHorasIrregularesKPIUseCase {

  constructor(
    private checkInvalidHours: CheckInvalidHours,
    private consultarMarcacaoPontosUseCase: ConsultaMarcacaoPontosUseCase
  ) { }

  async consultar(
    dto: ConsultaMarcacaoDTO,
  ): Promise<ResHorasIrregularesDTO[]> {
    try {
      const { ccid, dataFim, dataInicio, indetificador } = dto;
      Logger.debug(dto);

      const marcacaoPontos = await this.consultarMarcacaoPontosUseCase.consulta({
        limit: 1_000_000,
        ccid: ccid,
        indetificador: indetificador,
        dataInicio: dataInicio || formatyyyy_MM_dd(startOfMonth(new Date())),
        dataFim: dataFim || formatyyyy_MM_dd(endOfMonth(new Date()))
      });


      /**
       * O método groupBy agora retorna o mapa já com os objetos completos.
       */
      const invalidHoursMap = this.groupByMatricula(marcacaoPontos.data);

      return Array.from(invalidHoursMap.values())
      .sort((a, b) => b.horasIrregulares - a.horasIrregulares)
      .slice(0, 20);
    } catch (error) {
      throw new InternalServerErrorException('Falha ao consultar relatorio de horas iregulares');
    }
  }

  // Mudança aqui: O retorno agora é um Map de string -> DTO Completo
  private groupByMatricula(registros: ResRegistroPontoTurnoPontoDTO[]): Map<string, ResHorasIrregularesDTO> {

    return registros.reduce((acc, registro) => {
      // Se a matrícula ainda não existe no mapa, criamos a entrada inicial
      // pegando o Nome e Setor deste primeiro registro encontrado.
      if (!acc.has(registro.matricula)) {
        acc.set(registro.matricula, {
          matricula: registro.matricula,
          nome: registro.nome,
          setor: registro.setor,
          horasIrregulares: 0
        });
      }
      const entry = acc.get(registro.matricula)!;
      entry.horasIrregulares += this.checkInvalidHours.checkInvalidHours({
        workedhours: registro.qtdHoras
      });
      return acc;
    }, new Map<string, ResHorasIrregularesDTO>());
  }
}