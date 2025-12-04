import { Injectable } from '@nestjs/common';
import { IImpressoraBluetoothRepository } from '../@core/interfaces/IImpressoraBluetoothRepository';

@Injectable()
export class DeleteImpressoraBluetoothUseCase {
  constructor(private readonly repository: IImpressoraBluetoothRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository._delete(id);
  }
}
