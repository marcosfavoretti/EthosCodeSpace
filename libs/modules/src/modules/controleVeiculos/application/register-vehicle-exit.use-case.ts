import { Injectable, Logger, Inject } from '@nestjs/common';
import { IVeiculoRepository } from '../@core/interface/IVeiculo.repository';
import { VehicleResponseDto } from '@app/modules/contracts/dto/vehicle-response.dto';
import { IntelbrasEventDTO } from 'libs/modules/contracts/dto/intelbras-event.dto';
import { VeiculoEstado } from '../@core/enum/VeiculoEstados';
import { Veiculo } from '../@core/entity/Veiculo.entity';
import { IStorageService } from '../../storage/@core/interfaces/IStorage.service';

@Injectable()
export class RegisterVehicleExitUseCase {
  private readonly logger = new Logger(RegisterVehicleExitUseCase.name);

  constructor(
    @Inject(IStorageService)
    private readonly storageService: IStorageService,
    @Inject(IVeiculoRepository)
    private readonly veiculoRepository: IVeiculoRepository,
  ) {}

  async execute(request: IntelbrasEventDTO): Promise<VehicleResponseDto> {
    const { Plate, Vehicle, SnapInfo, NormalPic} = request.Picture;
    const placa = Plate.PlateNumber;

    this.logger.log(`Attempting to register vehicle exit for placa: ${placa}`);

    const veiculoExistente = await this.veiculoRepository.findLatestByPlaca(placa);

    // Lógica de negócio: Alerta se o veículo já estava fora ou não existia
    if (!veiculoExistente) {
      this.logger.warn(`Veículo com placa ${placa} não encontrado no sistema, criando novo registro de saída.`);
    } else if (veiculoExistente.status === VeiculoEstado.OUTSIDE) {
      this.logger.warn(`Veículo com placa ${placa} já constava como OUTSIDE. Possível falha no evento de entrada.`);
      await this.veiculoRepository.save({
        ...veiculoExistente,
        status: VeiculoEstado.FORCE_CLOSE
      });
    }

    // Criamos a nova instância centralizando a lógica de "fallback" (ou usa o novo, ou o antigo, ou 'Unknown')
    const novoStatusVeiculo = new Veiculo();
    novoStatusVeiculo.placa = placa;
    novoStatusVeiculo.status = VeiculoEstado.OUTSIDE;
    novoStatusVeiculo.marca = Vehicle.VehicleSeries ?? veiculoExistente?.marca ?? 'Unknown';
    novoStatusVeiculo.modelo = Vehicle.VehicleType ?? veiculoExistente?.modelo ?? 'Unknown';
    novoStatusVeiculo.cor = Vehicle.VehicleColor ?? veiculoExistente?.cor ?? 'Unknown';
    novoStatusVeiculo.ano = SnapInfo.AccurateTime 
      ? new Date(SnapInfo.AccurateTime).getFullYear() 
      : (veiculoExistente?.ano ?? new Date().getFullYear());

    const veiculoSalvo = await this.veiculoRepository.save(novoStatusVeiculo);

    if(NormalPic){
      await this.storageService.save(
        '',
        NormalPic.PicName,
        Buffer.from(NormalPic.Content, 'base64'),
        true
      );
    }

    this.logger.log(`Vehicle exit registered successfully for placa: ${placa}`);

    return this.mapToResponseDto(veiculoSalvo);
  }

  private mapToResponseDto(veiculo: Veiculo): VehicleResponseDto {
    return {
      id: veiculo.id,
      placa: veiculo.placa,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano,
      cor: veiculo.cor,
      createdAt: veiculo.createdAt,
      updatedAt: veiculo.updatedAt,
      status: veiculo.status,
    };
  }
}