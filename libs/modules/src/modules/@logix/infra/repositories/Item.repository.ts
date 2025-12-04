import { DataSource, Repository } from 'typeorm';
import { Item } from '../../@core/entities/Item.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemRepository extends Repository<Item> {
  constructor(@InjectDataSource('logix') dt: DataSource) {
    super(Item, dt.createEntityManager());
  }
}
