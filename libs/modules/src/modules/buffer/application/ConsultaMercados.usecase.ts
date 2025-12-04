import { Inject, Logger } from '@nestjs/common'; // Adicionado Logger
import { ConsultaMercadoService } from '../infra/service/ConsultarMercado.service';
import { parse } from 'date-fns';
import { In, Repository } from 'typeorm';
import { ProductionRepository } from '../../@syneco/infra/repositories/Production.repository';
import { Production } from '../../@syneco/@core/entities/Production.entity';
import { ConsultaMercadoDTO } from '@app/modules/contracts/dto/ConsultaMercado.dto';
import {
  BufferHistoricoDTO,
  BufferItemDto,
  ResMercadosIntermediarioDoSetorDTO,
} from '@app/modules/contracts/dto/ResMercadosDoSetor.dto';
import { parseDD_MM_yyyy_str } from '@app/modules/utils/datefns.wrapper';

export class ConsultarMercadoUseCase {
  private readonly logger = new Logger(ConsultarMercadoUseCase.name); // Logger para depuração

  constructor(
    @Inject(ConsultaMercadoService)
    private consultaMercadoService: ConsultaMercadoService,
    @Inject(ProductionRepository)
    private productionRepo: Repository<Production>,
  ) {}

  async consulta(
    dto: ConsultaMercadoDTO,
  ): Promise<ResMercadosIntermediarioDoSetorDTO[]> {
    this.logger.debug(
      `Iniciando consulta para setorId: ${dto.setorId}, dia: ${dto.dia}`,
    );

    const dataConsulta = parseDD_MM_yyyy_str(dto.dia); // Data de referência para o parse

    // 1. Obter os resultados iniciais dos mercados com seus histBuffer
    const results = await this.consultaMercadoService.consultarMercadosDoSetor(
      dto.setorId,
      dataConsulta,
    );

    if (!results || results.length === 0) {
      this.logger.log(
        `Nenhum mercado encontrado para setorId: ${dto.setorId} no dia ${dto.dia}`,
      );
      return []; // Retorna um array vazio se não houver resultados
    }

    // 2. Coletar todos os PartCodes únicos de todos os histBuffer em todos os mercados
    const allPartCodes: Set<string> = new Set();
    for (const result of results) {
      if (result.histBuffer) {
        for (const itemBuffer of result.histBuffer) {
          if (itemBuffer.item && itemBuffer.item.Item) {
            allPartCodes.add(itemBuffer.item.Item);
          }
        }
      }
    }

    if (allPartCodes.size === 0) {
      this.logger.log(
        `Nenhum PartCode encontrado nos históricos de buffer para setorId: ${dto.setorId}`,
      );
      return []; // Retorna os resultados sem modificar item_cliente se não houver PartCodes
    }

    // 3. Consultar todas as Production em uma única query otimizada
    const productions = await this.productionRepo.find({
      where: {
        PartCode: In(Array.from(allPartCodes)), // Usando 'In' para uma única query otimizada
      },
      relations: ['productionData'], // Certifique-se que esta relação é necessária e bem indexada
      order: {
        ProductionID: 'desc', // Ordernar para pegar o mais recente se houver múltiplos
      },
    });
    this.logger.debug(
      `Encontradas ${productions.length} produções para ${allPartCodes.size} PartCodes.`,
    );

    // 4. Mapear as Production para acesso rápido por PartCode
    // Usamos um Map para garantir acesso O(1) e lidar com múltiplos resultados,
    // pegando o mais recente devido ao 'order: { ProductionID: 'desc' }'.
    const productionMap: Map<string, Production> = new Map();
    for (const prod of productions) {
      // Se houver múltiplas produções para o mesmo PartCode,
      // esta abordagem pega a primeira (que será a mais recente devido ao 'order: desc').
      if (!productionMap.has(prod.PartCode)) {
        productionMap.set(prod.PartCode, prod);
      }
    }
    // 5. Reconstruir e retornar a DTO de resposta
    const finalMercados: ResMercadosIntermediarioDoSetorDTO[] = results.map(
      (marketResult) => {
        const transformedHistBuffer: BufferHistoricoDTO[] =
          marketResult.histBuffer?.map((bufferItem) => {
            const associatedProduction = productionMap.get(
              bufferItem.item.Item,
            );
            const itemClienteValue =
              associatedProduction?.getItemCliente()?.Value?.trim() ||
              'não tem';

            return {
              id: bufferItem.id,
              serverTime: bufferItem.serverTime,
              buffer: bufferItem.buffer,
              item: {
                Item: bufferItem.item.Item,
                tipo_item: bufferItem.item.tipo_item,
                item_cliente: itemClienteValue, // Usar o valor da Production
              } as BufferItemDto, // Cast explícito para ItemDto
            };
          }) || []; // Garante que é um array vazio se histBuffer for nulo/undefined

        return {
          ...marketResult, // Copia todas as propriedades existentes
          histBuffer: transformedHistBuffer, // Substitui histBuffer pelo transformado
        };
      },
    );

    this.logger.debug(
      `Consulta finalizada. Retornando ${finalMercados.length} mercados.`,
    );
    return finalMercados;
  }
}
