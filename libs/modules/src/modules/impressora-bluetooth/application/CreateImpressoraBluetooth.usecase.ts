import { Injectable } from '@nestjs/common';
import { IImpressoraBluetoothRepository } from '../@core/interfaces/IImpressoraBluetoothRepository';
import { ImpressoraBluetooth } from '../@core/entities/impressora-bluetooth.entity';
import { CreateImpressoraBluetoothDto } from '@app/modules/contracts/dto/CreateImpressoraBluetooth.dto';

@Injectable()
export class CreateImpressoraBluetoothUseCase {
  constructor(private readonly repository: IImpressoraBluetoothRepository) {}

  async execute(
    impressora: CreateImpressoraBluetoothDto,
  ): Promise<ImpressoraBluetooth> {
    return await this.repository._create({
      macAddress: impressora.macAddress,
      nome: impressora.nome,
    });
  }
}
