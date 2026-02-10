import { VerificaLinhaCapabilidade } from "@app/modules/modules/planejador/@core/classes/VerificaLinhaCapabilidade";
import { Fabrica } from "@app/modules/modules/planejador/@core/entities/Fabrica.entity";
import { ItemComCapabilidade } from "@app/modules/modules/planejador/@core/entities/Item.entity";
import { Pedido } from "@app/modules/modules/planejador/@core/entities/Pedido.entity";
import { CODIGOSETOR } from "@app/modules/modules/planejador/@core/enum/CodigoSetor.enum";
import { IGerenciadorPlanejamentConsulta } from "@app/modules/modules/planejador/@core/interfaces/IGerenciadorPlanejamentoConsulta";
import { ISelecionarItem } from "@app/modules/modules/planejador/@core/interfaces/ISelecionarItem";
import { AlocaPorLinhaCapabilidade } from "@app/modules/modules/planejador/@core/services/AlocaPorLinhaCapabilidade";

describe('AlocaPorLinhaCapabilidade', () => {
  let service: AlocaPorLinhaCapabilidade;
  let mockGerenciador: Partial<IGerenciadorPlanejamentConsulta>;
  let mockSelecionador: Partial<ISelecionarItem>;

  beforeEach(() => {
    mockGerenciador = {
      diaParaAdiantarProducaoEncaixe: jest.fn().mockResolvedValue(new Map()),
    };
    mockSelecionador = {
      seleciona: jest.fn(),
    };

    service = new AlocaPorLinhaCapabilidade(
      mockGerenciador as any,
      mockSelecionador as any
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verificacaoCapacidade', () => {
    it('should return instance of VerificaLinhaCapabilidade', () => {
      const pedido = new Pedido();
      const item = new ItemComCapabilidade();
      item.getCodigo = () => '20-000-0001';
      pedido.item = item;

      const result = service.verificacaoCapacidade(pedido, CODIGOSETOR.PINTURALIQ);
      
      expect(result).toBeInstanceOf(VerificaLinhaCapabilidade);
    });
  });

  describe('alocacao', () => {
    it('should call diaParaAdiantarProducaoEncaixe with VerificaLinhaCapabilidade strategy', async () => {
      const fabrica = new Fabrica();
      const pedido = new Pedido();
      const item = new ItemComCapabilidade();
      item.getCodigo = () => '20-000-0001';
      item.capabilidade = () => 100;
      
      pedido.item = item;
      pedido.lote = 50;
      pedido.getSafeDate = () => new Date();

      const props = {
        fabrica,
        pedido,
        setor: CODIGOSETOR.PINTURALIQ,
        dias: [],
        itemContext: item,
        estrutura: null as any,
        planejamentoFabril: []
      };

      await service['alocacao'](props);

      expect(mockGerenciador.diaParaAdiantarProducaoEncaixe).toHaveBeenCalledWith(
        expect.any(Date),
        CODIGOSETOR.PINTURALIQ,
        item,
        50,
        expect.any(VerificaLinhaCapabilidade), // Important Check
        expect.any(Array)
      );
    });
  });
});
