import { ItemComCapabilidade } from '../entities/Item.entity';

export interface IConverteItem {
  converter(partcode: string): Promise<ItemComCapabilidade>;
}
export const IConverteItem = Symbol('IConverteItem');
