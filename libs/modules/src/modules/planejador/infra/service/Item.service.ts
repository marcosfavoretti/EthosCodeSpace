import { Inject, Injectable } from '@nestjs/common';
import { ItemRepository } from '../repository/Item.repository';
import { ItemComCapabilidade } from '../../@core/entities/Item.entity';
import { In, Like } from 'typeorm';

export class ItemService {
  constructor(@Inject(ItemRepository) private itemRepository: ItemRepository) {}

  async salvarItem(item: ItemComCapabilidade): Promise<ItemComCapabilidade> {
    return await this.itemRepository.save(item);
  }

  async consultarItem(partcode: string): Promise<ItemComCapabilidade> {
    return await this.itemRepository.findOneOrFail({
      where: {
        Item: partcode,
      },
    });
  }
  
  async consultarItens(itensIds: string[]): Promise<ItemComCapabilidade[]> {
    return await this.itemRepository.find({
      where: {
        Item: In(itensIds),
      },
    });
  }

  async consultarTodosItensZerozero(): Promise<ItemComCapabilidade[]> {
    return await this.itemRepository.find({
      where: {
        Item: Like('%-000-%'),
      },
    });
  }
}
