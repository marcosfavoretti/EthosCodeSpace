import { Production } from '@app/modules/modules/@syneco/@core/entities/Production.entity';

export interface ILinkOrdemComEtiqueta {
  link(production: Production, data: string): Promise<void>;
}
