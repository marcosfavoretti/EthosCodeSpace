import { Module } from '@nestjs/common';
import { VeiculoRepository } from './infra/repository/Veiculo.repository';
import { RegisterVehicleEntryUseCase } from './application/register-vehicle-entry.use-case';
import { RegisterVehicleExitUseCase } from './application/register-vehicle-exit.use-case';
import { IVeiculoRepository } from './@core/interface/IVeiculo.repository';

@Module({
  imports: [
  ],
  providers: [
    // Services
    {
      provide: IVeiculoRepository,
      useClass: VeiculoRepository,
    },
    // Use Cases
    RegisterVehicleEntryUseCase,
    RegisterVehicleExitUseCase,
  ],
  exports: [
    // Export providers if they need to be used by other modules
    IVeiculoRepository,
    RegisterVehicleEntryUseCase,
    RegisterVehicleExitUseCase,
  ],
})
export class ControleVeiculosModule {}
