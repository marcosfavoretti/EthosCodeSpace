import { PlanejamentoTemporario } from "@app/modules/modules/planejador/@core/classes/PlanejamentoTemporario";
import { VerificaLinhaCapabilidade } from "@app/modules/modules/planejador/@core/classes/VerificaLinhaCapabilidade";
import { ItemComCapabilidade } from "@app/modules/modules/planejador/@core/entities/Item.entity";
import { ItemCapabilidade } from "@app/modules/modules/planejador/@core/entities/ItemCapabilidade.entity";
import { CODIGOSETOR } from "@app/modules/modules/planejador/@core/enum/CodigoSetor.enum";

describe('VerificaLinhaCapabilidade', () => {
  let item000: ItemComCapabilidade;
  let item000_DiffLine: ItemComCapabilidade;
  let itemNot000: ItemComCapabilidade;
  let setor: CODIGOSETOR;

  beforeEach(() => {
    setor = CODIGOSETOR.PINTURALIQ;

    // Mock Item 1 (Line 'A')
    item000 = new ItemComCapabilidade();
    item000.Item = '20-000-0001';
    item000.linha = 'A';
    item000.itemCapabilidade = [
        { setor: { codigo: setor } as any, capabilidade: 100, leadTime: 1 } as ItemCapabilidade
    ];
    item000.capabilidade = jest.fn().mockReturnValue(100);
    item000.getCodigo = jest.fn().mockReturnValue('20-000-0001');

    // Mock Item 2 (Line 'B')
    item000_DiffLine = new ItemComCapabilidade();
    item000_DiffLine.Item = '20-000-0002';
    item000_DiffLine.linha = 'B';
    item000_DiffLine.getCodigo = jest.fn().mockReturnValue('20-000-0002');

    // Mock Item 3 (Not 000)
    itemNot000 = new ItemComCapabilidade();
    itemNot000.Item = '20-100-0001';
    itemNot000.getCodigo = jest.fn().mockReturnValue('20-100-0001');
  });

  it('should throw error if item is not -000-', () => {
    expect(() => {
      new VerificaLinhaCapabilidade(itemNot000, setor);
    }).toThrow('Só esperados itens 000 aqui. Pois só eles tem leadTimes');
  });

  it('should verify capacity correctly', () => {
    const strategy = new VerificaLinhaCapabilidade(item000, setor);
    
    // Capabilidade is 100
    expect(strategy.verificaCapacidade(100)).toBe(true);
    expect(strategy.verificaCapacidade(50)).toBe(true);
    expect(strategy.verificaCapacidade(101)).toBe(false);
  });

  it('should calculate remaining capacity correctly', () => {
    const strategy = new VerificaLinhaCapabilidade(item000, setor);
    
    // Capabilidade is 100
    expect(strategy.calculaCapacidade(40)).toBe(60);
    expect(strategy.calculaCapacidade(100)).toBe(0);
    expect(strategy.calculaCapacidade(120)).toBe(-20);
  });

  describe('consumes', () => {
    it('should return true if plan item is on the same line', () => {
        const strategy = new VerificaLinhaCapabilidade(item000, setor);
        
        const plan = new PlanejamentoTemporario();
        const planItem = new ItemComCapabilidade();
        planItem.linha = 'A';
        planItem.Item = '20-000-9999'; // Different code, same line
        plan.item = planItem;

        expect(strategy.consumes(plan)).toBe(true);
    });

    it('should return true if plan item is the exact same item', () => {
        const strategy = new VerificaLinhaCapabilidade(item000, setor);
        
        const plan = new PlanejamentoTemporario();
        plan.item = item000;

        expect(strategy.consumes(plan)).toBe(true);
    });

    it('should return false if plan item is on a different line', () => {
        const strategy = new VerificaLinhaCapabilidade(item000, setor);
        
        const plan = new PlanejamentoTemporario();
        const planItem = new ItemComCapabilidade();
        planItem.linha = 'B'; 
        plan.item = planItem;

        expect(strategy.consumes(plan)).toBe(false);
    });
  });
});
