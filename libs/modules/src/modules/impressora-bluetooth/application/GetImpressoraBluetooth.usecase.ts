import { Injectable, NotFoundException } from '@nestjs/common';
import { IImpressoraBluetoothRepository } from '../@core/interfaces/IImpressoraBluetoothRepository';
import { EntityNotFoundError } from 'typeorm';
import { ImpressoraBluetoothResponseDto } from '@app/modules/contracts/dto/ImpressoraBluetoothResponse.dto';

@Injectable()
export class GetImpressoraBluetoothUseCase {
  constructor(private readonly repository: IImpressoraBluetoothRepository) {}

  async execute(id: string): Promise<ImpressoraBluetoothResponseDto> {
    try {
      const impressora = await this.repository.findById(id);
      return {
        ...impressora!,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError)
        throw new NotFoundException('Nao foi encontrado a impressora');
      throw error;
    }
  }
}
