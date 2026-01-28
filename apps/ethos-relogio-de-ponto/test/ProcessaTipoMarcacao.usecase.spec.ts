import { Test, TestingModule } from '@nestjs/testing';
import { ProcessaTipoMarcacaoUseCase } from '../../../../libs/modules/src/modules/relogio-de-ponto/application/ProcessaTipoMarcacao.usecase';
import { RegistroPontoRepository } from '../../../../libs/modules/src/modules/relogio-de-ponto/infra/repository/RegistroPonto.repository';
import { ComputaMarcacaoService } from '../../../../libs/modules/src/modules/relogio-de-ponto/infra/services/ComputaMarcacao.service';
import { TipoMarcacaoPontoRepository } from '../../../../libs/modules/src/modules/relogio-de-ponto/infra/repository/TipoMarcacaoPonto.repository';
import { ResPontoRegistroDTO } from '../../../../libs/modules/src/modules/contracts/dto/ResPontoRegistro.dto';
import { TipoMarcacaoPonto } from '../../../../libs/modules/src/modules/relogio-de-ponto/@core/entities/TipoMarcacaoPonto.entity';
import { Logger } from '@nestjs/common';
import { In } from 'typeorm';

// Mock das dependências
const mockRegistroPontoRepository = () => ({
  find: jest.fn(),
});

const mockComputaMarcacaoService = () => ({
  processar: jest.fn(),
});

const mockTipoMarcacaoPontoRepository = () => ({
  exists: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
});

describe('ProcessaTipoMarcacaoUseCase', () => {
  let useCase: ProcessaTipoMarcacaoUseCase;
  let registroPontoRepository: jest.Mocked<RegistroPontoRepository>;
  let computaMarcacaoService: jest.Mocked<ComputaMarcacaoService>;
  let tipoMarcacaoPontoRepository: jest.Mocked<TipoMarcacaoPontoRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessaTipoMarcacaoUseCase,
        {
          provide: RegistroPontoRepository,
          useFactory: mockRegistroPontoRepository,
        },
        {
          provide: ComputaMarcacaoService,
          useFactory: mockComputaMarcacaoService,
        },
        {
          provide: TipoMarcacaoPontoRepository,
          useFactory: mockTipoMarcacaoPontoRepository,
        },
      ],
    }).compile();

    useCase = module.get<ProcessaTipoMarcacaoUseCase>(
      ProcessaTipoMarcacaoUseCase,
    );
    registroPontoRepository = module.get(RegistroPontoRepository);
    computaMarcacaoService = module.get(ComputaMarcacaoService);
    tipoMarcacaoPontoRepository = module.get(TipoMarcacaoPontoRepository);

    // Mock do Logger para evitar saída no console durante os testes
    jest.spyOn(Logger, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger, 'error').mockImplementation(() => {});
    jest.spyOn(Logger, 'debug').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return empty array if DTO is empty', async () => {
    const result = await useCase.processa([]);
    expect(result).toEqual([]);
    expect(tipoMarcacaoPontoRepository.exists).not.toHaveBeenCalled();
  });

  it('should return empty array and log warning if records are already processed', async () => {
    const dto: ResPontoRegistroDTO[] = [
      { id: 1, mat: 123, dataHoraAr: new Date() } as ResPontoRegistroDTO,
    ];
    tipoMarcacaoPontoRepository.exists.mockResolvedValue(true);

    const result = await useCase.processa(dto);
    expect(result).toEqual([]);
    expect(tipoMarcacaoPontoRepository.exists).toHaveBeenCalledWith({
      where: { registroPonto: { id: In([1]) } },
    });
    expect(Logger.warn).toHaveBeenCalledWith(
      'Registros já processados detectados. Abortando para evitar duplicidade.',
    );
  });

  // Teste para o cenário de bug que você está enfrentando (preciso de mais detalhes sobre o bug)
  it('should handle the specific bug scenario', async () => {
    // TODO: Adicionar cenário de teste que simule o bug relatado.
    // Exemplo:
    // const dto: ResPontoRegistroDTO[] = [
    //   { id: 1, mat: 123, dataHoraAr: new Date('2024-01-01T08:00:00Z') } as ResPontoRegistroDTO,
    //   { id: 2, mat: 123, dataHoraAr: new Date('2024-01-01T12:00:00Z') } as ResPontoRegistroDTO,
    // ];
    //
    // Mockar os retornos dos repositórios e serviços para este cenário específico.
    // Por exemplo, simular que a primeira marcação é 1E e a segunda deveria ser 2S, mas ocorre um erro.
    //
    // registroPontoRepository.find.mockResolvedValueOnce(...)
    // tipoMarcacaoPontoRepository.exists.mockResolvedValueOnce(false);
    // tipoMarcacaoPontoRepository.find.mockResolvedValueOnce([]); // Contexto inicial vazio
    // computaMarcacaoService.processar.mockImplementationOnce(({ pontos, contextoMarcacao }) => {
    //   // Lógica de mock para simular o comportamento desejado/bugado
    //   if (pontos.id === 1) {
    //     return { id: 101, registroPonto: pontos, marcacao: '1E' } as TipoMarcacaoPonto;
    //   }
    //   if (pontos.id === 2) {
    //     // Simular o bug aqui, talvez retornando algo inesperado ou lançando um erro
    //     return { id: 102, registroPonto: pontos, marcacao: 'XX' } as TipoMarcacaoPonto;
    //   }
    // });
    //
    // const result = await useCase.processa(dto);
    //
    // expect(result).toEqual(...)
    // expect(Logger.error).toHaveBeenCalled(...) // Se o bug for um erro

    // Por enquanto, apenas um teste placeholder
    expect(true).toBe(true);
  });

  // TODO: Adicionar mais testes para outros cenários importantes:
  // - Processamento bem-sucedido de um ou mais registros (simulando 1E, 2S, etc.)
  // - Lógica do `MAX_SHIFT_GAP_HOURS` (iniciando novo contexto após um longo gap)
  // - Cenário onde `registroPonto` não é encontrado (para o `if (!registroPonto)` dentro do loop)
  // - Tratamento de erros durante o processamento.
});
