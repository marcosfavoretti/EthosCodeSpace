import { Injectable } from '@nestjs/common';
import { IImpressoraBluetoothRepository } from '../@core/interfaces/IImpressoraBluetoothRepository';
import { ImpressoraBluetoothResponseDto } from '@app/modules/contracts/dto/ImpressoraBluetoothResponse.dto';

@Injectable()
export class ListImpressoraBluetoothUseCase {
  constructor(private readonly repository: IImpressoraBluetoothRepository) {}

  async execute(): Promise<ImpressoraBluetoothResponseDto[]> {
    const impressoras = await this.repository.findAll();
    return impressoras.map((imp) => ({
      ...imp,
    }));
  }
}
