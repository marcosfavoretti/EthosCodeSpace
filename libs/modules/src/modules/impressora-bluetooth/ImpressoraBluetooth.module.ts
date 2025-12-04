import { Module } from '@nestjs/common';
import { ImpressoraBluetoothRepository } from './infra/repository/impressora-bluetooth.repository';
import { ImpressoraBluetoothService } from './infra/services/impressora-bluetooth.service';
import { CreateImpressoraBluetoothUseCase } from './application/CreateImpressoraBluetooth.usecase';
import { DeleteImpressoraBluetoothUseCase } from './application/DeleteImpressoraBluetooth.usecase';
import { GetImpressoraBluetoothUseCase } from './application/GetImpressoraBluetooth.usecase';
import { ListImpressoraBluetoothUseCase } from './application/ListImpressoraBluetooth.usecase';
import { UpdateImpressoraBluetoothUseCase } from './application/UpdateImpressoraBluetooth.usecase';
import { IImpressoraBluetoothRepository } from './@core/interfaces/IImpressoraBluetoothRepository';

@Module({
  imports: [],
  providers: [
    ImpressoraBluetoothService,
    CreateImpressoraBluetoothUseCase,
    DeleteImpressoraBluetoothUseCase,
    GetImpressoraBluetoothUseCase,
    ListImpressoraBluetoothUseCase,
    UpdateImpressoraBluetoothUseCase,
    {
      provide: IImpressoraBluetoothRepository,
      useClass: ImpressoraBluetoothRepository,
    },
  ],
  exports: [
    ImpressoraBluetoothService,
    CreateImpressoraBluetoothUseCase,
    DeleteImpressoraBluetoothUseCase,
    GetImpressoraBluetoothUseCase,
    ListImpressoraBluetoothUseCase,
    UpdateImpressoraBluetoothUseCase,
    IImpressoraBluetoothRepository,
  ],
})
export class ImpressoraBluetoothModule {}
