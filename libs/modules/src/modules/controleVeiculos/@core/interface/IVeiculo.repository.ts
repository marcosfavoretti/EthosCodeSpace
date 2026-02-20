import { Repository } from 'typeorm';
import { Veiculo } from '../entity/Veiculo.entity';
export const IVeiculoRepository = Symbol('IVeiculoRepository');
export interface IVeiculoRepository extends Repository<Veiculo> {
  findLatestByPlaca(placa: string): Promise<Veiculo | null>;
}
