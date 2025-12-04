import { ItemAnaliseDTO } from '../classes/ItemAnalise';

export abstract class Metricas {
  constructor(private name: string) {}

  async hookMetric(
    item: ItemAnaliseDTO,
    operation: CodigoSetores,
  ): Promise<MetricasDTO> {
    const metricResult = await this.executeMetric(item, operation);
    return {
      nome: this.name,
      valor: metricResult,
    };
  }
  abstract executeMetric(
    item: ItemAnaliseDTO,
    operation: CodigoSetores,
  ): Promise<string>;
}
