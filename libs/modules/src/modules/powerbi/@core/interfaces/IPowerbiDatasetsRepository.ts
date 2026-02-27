import { PowerbiDatasets } from '../entities/PowerbiDatasets.entity';
import {Repository} from "typeorm";
export interface IPowerbiDatasetsRepository extends Repository<PowerbiDatasets>{
  // findAll(): Promise<PowerbiDatasets[]>;
  // findById(id: number): Promise<PowerbiDatasets | null>;
  // save(dataset: PowerbiDatasets): Promise<PowerbiDatasets>;
  // create(data: Partial<PowerbiDatasets>): PowerbiDatasets;
}

export const IPowerbiDatasetsRepository = Symbol('IPowerbiDatasetsRepository');
