import { Injectable, Logger, Inject } from '@nestjs/common';
import { IVeiculoRepository } from '../@core/interface/IVeiculo.repository';
import { IntelbrasEventDTO } from 'libs/modules/contracts/dto/intelbras-event.dto';
import { VehicleResponseDto } from '@app/modules/contracts/dto/vehicle-response.dto';
import { VeiculoEstado } from '../@core/enum/VeiculoEstados';
import { Veiculo } from '../@core/entity/Veiculo.entity';
import { IStorageService } from '../../storage/@core/interfaces/IStorage.service';

@Injectable()
export class RegisterVehicleEntryUseCase {
  private readonly logger = new Logger(RegisterVehicleEntryUseCase.name);

  constructor(
    @Inject(IStorageService)
    private readonly storageService: IStorageService,
    @Inject(IVeiculoRepository)
    private readonly veiculoRepository: IVeiculoRepository
  ) {}

  async execute(request: IntelbrasEventDTO): Promise<VehicleResponseDto> {
    const { Plate, Vehicle, SnapInfo, NormalPic } = request.Picture;
    const placa = Plate.PlateNumber;

    this.logger.log(`Attempting to register vehicle entry for placa: ${placa}`);

    const veiculoAntigo = await this.veiculoRepository.findLatestByPlaca(placa);

    // 1. Trata inconsistência de estado (Force Close)
    if (veiculoAntigo?.status === VeiculoEstado.INSIDE) {
      this.logger.warn(`Veículo ${placa} já estava INSIDE. Forçando fechamento do registro anterior.`);
      await this.veiculoRepository.save({ 
        ...veiculoAntigo, 
        status: VeiculoEstado.FORCE_CLOSE 
      });
    }

    // 2. Criação centralizada do novo registro de entrada
    const novoVeiculo = this.veiculoRepository.create({
      placa,
      status: VeiculoEstado.INSIDE,
      marca: Vehicle.VehicleSeries ?? veiculoAntigo?.marca ?? 'Unknown',
      modelo: Vehicle.VehicleType ?? veiculoAntigo?.modelo ?? 'Unknown',
      cor: Vehicle.VehicleColor ?? veiculoAntigo?.cor ?? 'Unknown',
      ano: SnapInfo.AccurateTime 
        ? new Date(SnapInfo.AccurateTime).getFullYear() 
        : (veiculoAntigo?.ano ?? new Date().getFullYear()),
    });

    const veiculoSalvo = await this.veiculoRepository.save(novoVeiculo);

    // 3. Processamento de imagem (Upload)
    if(NormalPic){
      await this.storageService.save(
        '',
        NormalPic.PicName,
        Buffer.from(NormalPic.Content, 'base64'),
        true
      );
    }

    this.logger.log(`Vehicle entry registered successfully: ${placa} (ID: ${veiculoSalvo.id})`);

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