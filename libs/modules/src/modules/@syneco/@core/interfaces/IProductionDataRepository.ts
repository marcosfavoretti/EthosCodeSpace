import { Repository } from 'typeorm';
import { ProductionData } from '../entities/ProductionData.entity';

export interface IProductionDataRepository extends Repository<ProductionData> {}
export const IProductionDataRepository = Symbol('IProductionDataRepository');
