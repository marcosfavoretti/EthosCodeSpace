import { Repository } from 'typeorm';
import { QualidadeImagens } from '../entities/QualidadeImagens.entity';

export interface IQualidadeImagemRepository
  extends Repository<QualidadeImagens> {}

export const IQualidadeImagemRepository = Symbol('IQualidadeImagemRepository');
