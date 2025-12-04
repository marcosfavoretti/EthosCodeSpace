import { Injectable } from '@nestjs/common';
import { IImpressoraBluetoothRepository } from '../@core/interfaces/IImpressoraBluetoothRepository';
import { ImpressoraBluetooth } from '../@core/entities/impressora-bluetooth.entity';

@Injectable()
export class UpdateImpressoraBluetoothUseCase {
  constructor(private readonly repository: IImpressoraBluetoothRepository) {}

  async execute(
    id: string,
    impressora: Partial<ImpressoraBluetooth>,
  ): Promise<ImpressoraBluetooth | undefined> {
    return this.repository._update(id, impressora);
  }
}
