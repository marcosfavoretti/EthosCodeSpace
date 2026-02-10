import { PlanejamentoTemporario } from '@app/modules/modules/planejador/@core/classes/PlanejamentoTemporario';
import { ItemComCapabilidade } from '@app/modules/modules/planejador/@core/entities/Item.entity';
import { CODIGOSETOR } from '@app/modules/modules/planejador/@core/enum/CodigoSetor.enum';
import { IVerificaCapacidade } from '@app/modules/modules/planejador/@core/interfaces/IVerificaCapacidade';
import { PlanejamentoValidatorExecutorService } from '@app/modules/modules/planejador/@core/services/PlanejamentoValidatorExecutor.service';
import { ConsultaPlanejamentoService } from '@app/modules/modules/planejador/infra/service/ConsultaPlanejamentos.service';
import { EfetivaPlanejamentoService } from '@app/modules/modules/planejador/infra/service/EfetivaPlanejamento.service';
import { GerenciadorPlanejamento } from '@app/modules/modules/planejador/infra/service/GerenciadorPlanejamento';
import { Test, TestingModule } from '@nestjs/testing';

describe('GerenciadorPlanejamento', () => {
  let service: GerenciadorPlanejamento;
  let mockValidator: Partial<PlanejamentoValidatorExecutorService>;
  let mockEfetiva: Partial<EfetivaPlanejamentoService>;
  let mockConsulta: Partial<ConsultaPlanejamentoService>;

  beforeEach(async () => {
    mockValidator = { execute: jest.fn() };
    mockEfetiva = { efetiva: jest.fn(), remove: jest.fn() };
    mockConsulta = { consultaPlanejamentoAtual: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GerenciadorPlanejamento,
        { provide: PlanejamentoValidatorExecutorService, useValue: mockValidator },
        { provide: EfetivaPlanejamentoService, useValue: mockEfetiva },
        { provide: ConsultaPlanejamentoService, useValue: mockConsulta },
      ],
    }).compile();

    service = module.get<GerenciadorPlanejamento>(GerenciadorPlanejamento);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('possoAlocarQuantoNoDia', () => {
    it('should sum quantity ONLY for items that strategy.consumes returns true', async () => {
      const dia = new Date('2023-01-01T00:00:00.000Z');
      const setor = CODIGOSETOR.SOLDA;
      const item = new ItemComCapabilidade();
      item.getCodigo = () => 'ITEM-A';

      // Mock Strategy
      const strategy: IVerificaCapacidade = {
        verificaCapacidade: jest.fn(),
        calculaCapacidade: jest.fn((total) => 100 - total), // Capacity 100
        consumes: jest.fn((p) => p.item.getCodigo() === 'ITEM-A'), // Simple equality strategy
      };

      // Mock DB Plans
      const plan1 = new PlanejamentoTemporario();
      plan1.dia = dia;
      plan1.setor = setor;
      plan1.item = { getCodigo: () => 'ITEM-A' } as ItemComCapabilidade;
      plan1.qtd = 20;

      const plan2 = new PlanejamentoTemporario();
      plan2.dia = dia;
      plan2.setor = setor;
      plan2.item = { getCodigo: () => 'ITEM-B' } as ItemComCapabilidade;
      plan2.qtd = 50; // Should be ignored by strategy

      // Mock Temp Plans
      const plan3 = new PlanejamentoTemporario();
      plan3.dia = dia;
      plan3.setor = setor;
      plan3.item = { getCodigo: () => 'ITEM-A' } as ItemComCapabilidade;
      plan3.qtd = 10;

      const result = await service.possoAlocarQuantoNoDia(
        dia,
        setor,
        item,
        strategy,
        [plan1, plan2], // DB
        [plan3]         // Temp
      );

      // Expected Total: 20 (plan1) + 10 (plan3) = 30.
      // plan2 is ignored because consumes('ITEM-B') is false.
      // Remaining: 100 - 30 = 70.
      expect(result).toBe(70);
      expect(strategy.consumes).toHaveBeenCalledTimes(3);
    });
  });

  describe('possoAlocarNoDia', () => {
    it('should utilize strategy.consumes to validate capacity', async () => {
        const dia = new Date('2023-01-01T00:00:00.000Z');
        const setor = CODIGOSETOR.SOLDA;
        const item = new ItemComCapabilidade();
  
        const strategy: IVerificaCapacidade = {
          verificaCapacidade: jest.fn().mockReturnValue(true),
          calculaCapacidade: jest.fn(), 
          consumes: jest.fn().mockReturnValue(true), // Consumes everything
        };
  
        const plan1 = new PlanejamentoTemporario();
        plan1.dia = dia;
        plan1.setor = setor;
        plan1.item = item;
        plan1.qtd = 50;
  
        await service.possoAlocarNoDia(
          dia,
          setor,
          item,
          10,
          strategy,
          [plan1]
        );
  
        // Total should be 50 (plan1) + 10 (requested) = 60
        expect(strategy.verificaCapacidade).toHaveBeenCalledWith(60);
    });
  });
});
