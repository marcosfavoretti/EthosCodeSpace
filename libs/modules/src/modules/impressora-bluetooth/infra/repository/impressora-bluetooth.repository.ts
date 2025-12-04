import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IImpressoraBluetoothRepository } from '../../@core/interfaces/IImpressoraBluetoothRepository';
import { ImpressoraBluetooth } from '../../@core/entities/impressora-bluetooth.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ImpressoraBluetoothRepository
  extends Repository<ImpressoraBluetooth>
  implements IImpressoraBluetoothRepository
{
  constructor(
    @InjectDataSource('syneco_database')
    private readonly dt: DataSource,
  ) {
    super(ImpressoraBluetooth, dt.createEntityManager());
  }

  async _create(impressora: ImpressoraBluetooth): Promise<ImpressoraBluetooth> {
    console.log(impressora);
    return this.save({ ...impressora, id: randomUUID() });
  }

  async findById(id: string): Promise<ImpressoraBluetooth | undefined> {
    return this.findOneOrFail({ where: { id } });
  }

  async findByMacAddress(
    macAddress: string,
  ): Promise<ImpressoraBluetooth | undefined> {
    return this.findOneOrFail({ where: { macAddress } });
  }

  async findAll(): Promise<ImpressoraBluetooth[]> {
    return this.find();
  }

  async _update(
    id: string,
    impressora: Partial<ImpressoraBluetooth>,
  ): Promise<ImpressoraBluetooth | undefined> {
    await this.update(id, impressora);
    return this.findById(id);
  }

  async _delete(id: string): Promise<void> {
    await this.delete(id);
  }
}
