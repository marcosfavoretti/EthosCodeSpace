import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { IBuscarItemDependecias } from '../../@core/interfaces/IBuscarItemDependecias';
import { IConsultaRoteiro } from '../../@core/interfaces/IConsultaRoteiro';
import { IConverteItem } from '../../@core/interfaces/IConverteItem';
import { IMontaEstrutura } from '../../@core/interfaces/IMontaEstrutura.ts';
import { ItemService } from './Item.service';
import { ItemComCapabilidade } from '../../@core/entities/Item.entity';
import { CODIGOSETOR } from '../../@core/enum/CodigoSetor.enum';
import { ItemEstruturado } from '../../@core/classes/ItemEstruturado';
import { EstruturaHttpClient } from '@app/modules/contracts/clients/EstruturaHttp.client';

export class EstruturaNeo4jApiService
  implements
    IConsultaRoteiro,
    IConverteItem,
    IBuscarItemDependecias,
    IMontaEstrutura
{
  @Inject(ItemService) private itemService: ItemService;
  @Inject(EstruturaHttpClient) private estruturaHttpClient: EstruturaHttpClient;

  async roteiro(partcode: ItemComCapabilidade): Promise<CODIGOSETOR[]> {
    try {
      const { data } = await this.estruturaHttpClient.client.get<string[]>(
        '/estrutura/roteiro',
        {
          params: { partcode: partcode.getCodigo() },
        },
      );
      return data as CODIGOSETOR[];
    } catch (error) {
      console.error(`item com problema`, partcode);
      throw new Error(
        `Servico de estrutura offline (ROTEIRO) ${error.status} ${error.message}`,
      );
    }
  }

  async monteEstrutura(item: ItemComCapabilidade): Promise<ItemEstruturado> {
    const itensDependentes = await this.buscar(item);
    const itemEstrutura = new ItemEstruturado();
    itemEstrutura.itemFinal = item;
    itemEstrutura.itemRops = itensDependentes[itensDependentes.length - 1];
    itemEstrutura.itensDependencia = itensDependentes.slice(
      0,
      itensDependentes.length - 1,
    );
    return itemEstrutura;
  }

  async buscar(item: ItemComCapabilidade): Promise<ItemComCapabilidade[]> {
    try {
      const itensDeControle =
        await this.estruturaHttpClient.buscarItemDeControle({
          partcode: item.getCodigo(),
        });
      const itens = await this.itemService.consultarItens(itensDeControle);
      const itensSequence = itensDeControle.map(
        (dado) => itens.find((i) => i.getCodigo() === dado)!,
      );
      return itensSequence;
    } catch (error) {
      Logger.error(error);
      throw new Error(
        `Servico de estrutura offline (BUSCAR) ${error.status} ${error.message}`,
      );
    }
  }

  async converter(partcode: string): Promise<ItemComCapabilidade> {
    try {
      const itensControle = await this.estruturaHttpClient.buscarItemDeControle(
        {
          partcode,
        },
      );
      const partcode_resolved = itensControle.at(itensControle.length - 1);
      if (!partcode_resolved)
        throw new InternalServerErrorException(
          'Partcode nao foi resolvido corretamente',
        );
      return await this.itemService.consultarItem(partcode_resolved);
    } catch (error) {
      throw new Error(
        `Servico de estrutura offline (CONVERSAO) ${error.status} ${error.message}`,
      );
    }
  }
}
