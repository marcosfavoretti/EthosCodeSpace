import { FabricaPlanejamentoResultado } from './FabricaPlanejamentoResultado';
import { PlanejamentoTemporario } from './PlanejamentoTemporario';

export class FabricaReplanejamentoResultado extends FabricaPlanejamentoResultado {
  retirado: PlanejamentoTemporario[];
}
