import { ImpressoraBluetooth } from '../entities/impressora-bluetooth.entity';

export abstract class IImpressoraBluetoothRepository {
  abstract _create(
    impressora: Partial<ImpressoraBluetooth>,
  ): Promise<ImpressoraBluetooth>;
  abstract findById(id: string): Promise<ImpressoraBluetooth | undefined>;
  abstract findByMacAddress(
    macAddress: string,
  ): Promise<ImpressoraBluetooth | undefined>;
  abstract findAll(): Promise<ImpressoraBluetooth[]>;
  abstract _update(
    id: string,
    impressora: Partial<ImpressoraBluetooth>,
  ): Promise<ImpressoraBluetooth | undefined>;
  abstract _delete(id: string): Promise<void>;
}
