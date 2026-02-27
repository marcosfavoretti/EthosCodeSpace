import { Repository } from 'typeorm';
import { PowerbiAtualizacoes } from '../entities/PowerbiAtulizacao.entity';

export interface IPowerBIAtualizacaoRepository extends Repository<PowerbiAtualizacoes> {
}

export const IPowerBIAtualizacaoRepository = Symbol('IPowerBIAtualizacaoRepository');
