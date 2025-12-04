import { Injectable } from '@nestjs/common';
import { ImpressoraBluetooth } from '../../@core/entities/impressora-bluetooth.entity';
import { IImpressoraBluetoothRepository } from '../../@core/interfaces/IImpressoraBluetoothRepository';

@Injectable()
export class ImpressoraBluetoothService {
  constructor(
    private readonly impressoraBluetoothRepository: IImpressoraBluetoothRepository,
  ) {}

  async create(impressora: ImpressoraBluetooth): Promise<ImpressoraBluetooth> {
    return this.impressoraBluetoothRepository._create(impressora);
  }

  async findById(id: string): Promise<ImpressoraBluetooth | undefined> {
    return this.impressoraBluetoothRepository.findById(id);
  }

  async findByMacAddress(
    macAddress: string,
  ): Promise<ImpressoraBluetooth | undefined> {
    return this.impressoraBluetoothRepository.findByMacAddress(macAddress);
  }

  async findAll(): Promise<ImpressoraBluetooth[]> {
    return this.impressoraBluetoothRepository.findAll();
  }

  async update(
    id: string,
    impressora: Partial<ImpressoraBluetooth>,
  ): Promise<ImpressoraBluetooth | undefined> {
    return this.impressoraBluetoothRepository._update(id, impressora);
  }

  async delete(id: string): Promise<void> {
    await this.impressoraBluetoothRepository._delete(id);
  }
}
