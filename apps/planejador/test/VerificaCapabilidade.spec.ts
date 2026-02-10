import { PlanejamentoTemporario } from "@app/modules/modules/planejador/@core/classes/PlanejamentoTemporario";
import { VerificaCapabilidade } from "@app/modules/modules/planejador/@core/classes/VerificaCapabilidade";
import { ItemComCapabilidade } from "@app/modules/modules/planejador/@core/entities/Item.entity";
import { ItemCapabilidade } from "@app/modules/modules/planejador/@core/entities/ItemCapabilidade.entity";
import { CODIGOSETOR } from "@app/modules/modules/planejador/@core/enum/CodigoSetor.enum";

describe('VerificaCapabilidade', () => {
  let item000: ItemComCapabilidade;
  let setor: CODIGOSETOR;

  beforeEach(() => {
    setor = CODIGOSETOR.SOLDA;

    item000 = new ItemComCapabilidade();
    item000.Item = '20-000-0001';
    item000.itemCapabilidade = [
        { setor: { codigo: setor } as any, capabilidade: 50, leadTime: 2 } as ItemCapabilidade
    ];
    item000.capabilidade = jest.fn().mockReturnValue(50);
    item000.getCodigo = jest.fn().mockReturnValue('20-000-0001');
  });

  it('should initialize correctly for -000- items', () => {
    expect(new VerificaCapabilidade(item000, setor)).toBeDefined();
  });

  describe('consumes', () => {
    it('should return true ONLY if plan item code is exactly the same', () => {
        const strategy = new VerificaCapabilidade(item000, setor);
        
        const planSame = new PlanejamentoTemporario();
        planSame.item = item000;

        expect(strategy.consumes(planSame)).toBe(true);
    });

    it('should return false if plan item code is different (even if same family logic applied elsewhere)', () => {
        const strategy = new VerificaCapabilidade(item000, setor);
        
        const planDiff = new PlanejamentoTemporario();
        const otherItem = new ItemComCapabilidade();
        otherItem.Item = '20-000-0002';
        otherItem.getCodigo = jest.fn().mockReturnValue('20-000-0002');
        planDiff.item = otherItem;

        expect(strategy.consumes(planDiff)).toBe(false);
    });
  });
});
