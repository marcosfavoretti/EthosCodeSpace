import { Like } from 'typeorm';
import { Inject } from '@nestjs/common';
import { ProblemaConsultandoItemException } from '../../@core/exception/ProblemaConsultandoItem.exception';
import { ItemXQtdSemanaRepository } from '@app/modules/modules/@syneco/infra/repositories/ItemXQtdSemana.repository';
import { ItemXQtdSemana } from '@app/modules/modules/@syneco/@core/entities/ItemXQtdSemana.entity';
import { ItemXQtdSemanaComBuffer } from '../../@core/entities/ItemQtdSemana.entity';
import { ItemQtdSemanaComBufferRepository } from '../repository/ItemQtdSemanaComBuffer.repository';

export class ConsutlarItensAtivosService {
  constructor(
    @Inject(ItemQtdSemanaComBufferRepository)
    private itemQtdRepo: ItemQtdSemanaComBufferRepository,
  ) {}

  async itensAtivos110(): Promise<ItemXQtdSemanaComBuffer[]> {
    try {
      return await this.itemQtdRepo.find({
        where: {
          Item: Like('%-110-%'),
          status: 'S',
        },
      });
    } catch (error) {
      console.error(error);
      throw new ProblemaConsultandoItemException();
    }
  }
  async itensAtivos000(): Promise<ItemXQtdSemanaComBuffer[]> {
    try {
      return await this.itemQtdRepo.find({
        where: {
          Item: Like('%-000-%'),
          status: 'S',
        },
      });
    } catch (error) {
      console.error(error);
      throw new ProblemaConsultandoItemException();
    }
  }
  async itensAtivosTodos(): Promise<ItemXQtdSemanaComBuffer[]> {
    try {
      return await this.itemQtdRepo.find({
        where: {
          status: 'S',
        },
      });
    } catch (error) {
      console.error(error);
      throw new ProblemaConsultandoItemException();
    }
  }
}
