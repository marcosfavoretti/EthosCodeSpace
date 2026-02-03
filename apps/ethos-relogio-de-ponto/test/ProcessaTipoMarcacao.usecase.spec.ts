import { Test, TestingModule } from '@nestjs/testing';
import { ProcessaTipoMarcacaoUseCase } from '@app/modules/modules/relogio-de-ponto/application/ProcessaTipoMarcacao.usecase';
import { ComputaMarcacaoService } from '@app/modules/modules/relogio-de-ponto/infra/services/ComputaMarcacao.service';
import { RegistroPontoRepository } from '@app/modules/modules/relogio-de-ponto/infra/repository/RegistroPonto.repository';
import { TipoMarcacaoPontoRepository } from '@app/modules/modules/relogio-de-ponto//infra/repository/TipoMarcacaoPonto.repository';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import { TipoMarcacaoPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/TipoMarcacaoPonto.entity';
import { RegistroPonto } from '@app/modules/modules/relogio-de-ponto//@core/entities/RegistroPonto.entity';
import { RpcException } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('ProcessaTipoMarcacaoUseCase', () => {
  let useCase: ProcessaTipoMarcacaoUseCase;
  let dataSource: DataSource;
  let computaMarcacaoService: ComputaMarcacaoService;

  // Mocks for QueryRunner and Repositories obtained via QueryRunner
  let queryRunnerMock: Partial<QueryRunner>;
  let tipoMarcacaoRepoMock: Partial<Repository<TipoMarcacaoPonto>>;
  let registroPontoEntityRepoMock: Partial<Repository<RegistroPonto>>;

  // Mocks for Injected Dependencies (even if unused in the method, they are required for constructor)
  let registroPontoRepoInjectedMock: Partial<RegistroPontoRepository>;
  let tipoMarcacaoRepoInjectedMock: Partial<TipoMarcacaoPontoRepository>;

  beforeEach(async () => {
    // 1. Setup Mock Repositories that will be returned by QueryRunner
    tipoMarcacaoRepoMock = {
      exist: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    };

    registroPontoEntityRepoMock = {
      findOne: jest.fn(),
    };

    // 2. Setup Mock QueryRunner
    queryRunnerMock = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        getRepository: jest.fn((entity) => {
          if (entity === TipoMarcacaoPonto) return tipoMarcacaoRepoMock;
          if (entity === RegistroPonto) return registroPontoEntityRepoMock;
          return null;
        }),
      } as any,
    };

    // 3. Setup Mock DataSource
    const dataSourceMock = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
    };

    // 4. Setup other injected services
    const computaMarcacaoServiceMock = {
      processar: jest.fn(),
    };

    registroPontoRepoInjectedMock = {};
    tipoMarcacaoRepoInjectedMock = {};

    // 5. Create Testing Module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessaTipoMarcacaoUseCase,
        {
          provide: ComputaMarcacaoService,
          useValue: computaMarcacaoServiceMock,
        },
        {
          provide: RegistroPontoRepository,
          useValue: registroPontoRepoInjectedMock,
        },
        {
          provide: TipoMarcacaoPontoRepository,
          useValue: tipoMarcacaoRepoInjectedMock,
        },
        {
          provide: getDataSourceToken('logix'),
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    useCase = module.get<ProcessaTipoMarcacaoUseCase>(ProcessaTipoMarcacaoUseCase);
    dataSource = module.get<DataSource>(getDataSourceToken('logix'));
    computaMarcacaoService = module.get<ComputaMarcacaoService>(ComputaMarcacaoService);

    // Spy on Logger to suppress output during tests or verify logging
    jest.spyOn(Logger, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger, 'error').mockImplementation(() => {});
    jest.spyOn(Logger, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('processa', () => {
    it('deve fazer rollback e retornar array vazio se DTO for vazio', async () => {
      const result = await useCase.processa([]);

      expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
      expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunnerMock.release).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('deve fazer rollback e retornar array vazio se registros já existirem (duplicidade)', async () => {
      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(true);

      const dto: ResPontoRegistroDTO[] = [{ id: 1, mat: '123', dataHoraAr: new Date() } as any];
      const result = await useCase.processa(dto);

      expect(tipoMarcacaoRepoMock.exist).toHaveBeenCalled();
      expect(Logger.warn).toHaveBeenCalledWith(expect.stringContaining('Registros já processados'));
      expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('deve logar erro e continuar se RegistroPonto não for encontrado no banco', async () => {
      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
      (registroPontoEntityRepoMock.findOne as jest.Mock).mockResolvedValue(null);

      const dto: ResPontoRegistroDTO[] = [{ id: 1, mat: '123', dataHoraAr: new Date() } as any];
      const result = await useCase.processa(dto);

      expect(registroPontoEntityRepoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('não encontrado no banco'));
      
      // Should commit empty transaction effectively (or just finish loop and commit)
      expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
      expect(tipoMarcacaoRepoMock.save).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('deve processar corretamente fluxo normal (Happy Path)', async () => {
      const now = new Date();
      const dto: ResPontoRegistroDTO[] = [{ id: 1, mat: '123', dataHoraAr: now } as any];
      
      const registroPontoMock = { id: 1, mat: '123', dataHoraAr: now };
      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
      (registroPontoEntityRepoMock.findOne as jest.Mock).mockResolvedValue(registroPontoMock);
      (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue([]); // Sem histórico anterior
      
      const processadoMock = { id: 'new-id', marcacao: '1E' };
      (computaMarcacaoService.processar as jest.Mock).mockResolvedValue(processadoMock);

      const result = await useCase.processa(dto);

      expect(queryRunnerMock.connect).toHaveBeenCalled();
      expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
      expect(tipoMarcacaoRepoMock.find).toHaveBeenCalled(); // Verifica busca de contexto
      expect(computaMarcacaoService.processar).toHaveBeenCalledWith({
        pontos: registroPontoMock,
        contextoMarcacao: [],
      });
      expect(tipoMarcacaoRepoMock.save).toHaveBeenCalledWith([processadoMock]);
      expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual([processadoMock]);
    });

    it('deve manter contexto se gap for menor que 9h (MAX_SHIFT_GAP_HOURS)', async () => {
      const now = new Date('2023-01-01T12:00:00');
      const dto: ResPontoRegistroDTO[] = [{ id: 2, mat: '123', dataHoraAr: now } as any];
      
      const registroPontoMock = { id: 2, mat: '123', dataHoraAr: now };
      
      // Histórico recente (gap < 9h)
      const historicoMock = [
        { registroPonto: { dataHoraAr: new Date('2023-01-01T08:00:00') }, marcacao: '1E' }
      ];

      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
      (registroPontoEntityRepoMock.findOne as jest.Mock).mockResolvedValue(registroPontoMock);
      (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue(historicoMock);
      (computaMarcacaoService.processar as jest.Mock).mockResolvedValue({ marcacao: '1S' });

      await useCase.processa(dto);

      expect(computaMarcacaoService.processar).toHaveBeenCalledWith(expect.objectContaining({
        contextoMarcacao: historicoMock, // Deve passar o histórico pois o gap é 4h
      }));
    });

    it('deve resetar contexto se gap for maior que 9h (Novo Turno)', async () => {
      const now = new Date('2023-01-02T08:00:00');
      const dto: ResPontoRegistroDTO[] = [{ id: 2, mat: '123', dataHoraAr: now } as any];
      
      const registroPontoMock = { id: 2, mat: '123', dataHoraAr: now };
      
      // Histórico antigo (gap > 9h)
      const historicoMock = [
        { registroPonto: { dataHoraAr: new Date('2023-01-01T18:00:00') }, marcacao: '2S' }
      ];
      // Diff is 14 hours

      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
      (registroPontoEntityRepoMock.findOne as jest.Mock).mockResolvedValue(registroPontoMock);
      (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue(historicoMock);
      (computaMarcacaoService.processar as jest.Mock).mockResolvedValue({ marcacao: '1E' });

      await useCase.processa(dto);

      expect(Logger.debug).toHaveBeenCalledWith(expect.stringContaining('Gap de'));
      expect(computaMarcacaoService.processar).toHaveBeenCalledWith(expect.objectContaining({
        contextoMarcacao: [], // Deve ser vazio pois iniciou novo contexto
      }));
    });

    it('deve cortar contexto até "1E" se gap < 9h e "1E" existir no histórico', async () => {
        // Cenário:
        // Histórico tem: [1S (09:00), 1E (08:00), ...outros]
        // Nova batida: 12:00
        // Gap: 3h (<9h)
        // Deve pegar até o 1E.
        
        const now = new Date('2023-01-01T12:00:00');
        const dto: ResPontoRegistroDTO[] = [{ id: 3, mat: '123', dataHoraAr: now } as any];
        
        const registroPontoMock = { id: 3, mat: '123', dataHoraAr: now };
        
        const historicoMock = [
          { registroPonto: { dataHoraAr: new Date('2023-01-01T09:00:00') }, marcacao: '1S' }, // Index 0
          { registroPonto: { dataHoraAr: new Date('2023-01-01T08:00:00') }, marcacao: '1E' }, // Index 1
          { registroPonto: { dataHoraAr: new Date('2023-01-01T07:00:00') }, marcacao: 'XX' }, // Index 2 (lixo anterior)
        ];
  
        (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
        (registroPontoEntityRepoMock.findOne as jest.Mock).mockResolvedValue(registroPontoMock);
        (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue(historicoMock);
        (computaMarcacaoService.processar as jest.Mock).mockResolvedValue({});
  
        await useCase.processa(dto);
  
        // slice(0, indice1E + 1) -> slice(0, 1 + 1) -> slice(0, 2) -> returns index 0 and 1.
        const expectedContext = [historicoMock[0], historicoMock[1]];
  
        expect(computaMarcacaoService.processar).toHaveBeenCalledWith(expect.objectContaining({
          contextoMarcacao: expectedContext,
        }));
      });

    it('deve lidar com processamento em lote (loop acumulando contexto local)', async () => {
      // Cenário: 2 DTOs. O segundo deve ver o resultado do primeiro no contexto local.
      const time1 = new Date('2023-01-01T08:00:00');
      const time2 = new Date('2023-01-01T08:05:00');
      
      const dto: ResPontoRegistroDTO[] = [
        { id: 10, mat: '999', dataHoraAr: time1 } as any,
        { id: 11, mat: '999', dataHoraAr: time2 } as any,
      ];

      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
      
      // Mock findOne para retornar o registro correto
      (registroPontoEntityRepoMock.findOne as jest.Mock)
        .mockResolvedValueOnce({ id: 10, mat: '999', dataHoraAr: time1 })
        .mockResolvedValueOnce({ id: 11, mat: '999', dataHoraAr: time2 });

      (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue([]); // Banco vazio

      // Mock service
      // FIXED: Added 'mat' to registroPonto so the filter inside UseCase works correctly
      const res1 = { id: 'r1', marcacao: '1E', registroPonto: { dataHoraAr: time1, mat: '999' } };
      const res2 = { id: 'r2', marcacao: '1S', registroPonto: { dataHoraAr: time2, mat: '999' } };

      (computaMarcacaoService.processar as jest.Mock)
        .mockResolvedValueOnce(res1)
        .mockResolvedValueOnce(res2);

      const result = await useCase.processa(dto);

      expect(computaMarcacaoService.processar).toHaveBeenCalledTimes(2);
      
      // Primeira chamada: Contexto vazio
      expect(computaMarcacaoService.processar).toHaveBeenNthCalledWith(1, expect.objectContaining({
        contextoMarcacao: []
      }));

      // Segunda chamada: Deve ter o resultado da primeira no contextoLocalDesc
      // A lógica: const contextoLocalDesc = [...dadosProcessados].reverse();
      // dadosProcessados tem [res1]. reverse() mantem [res1].
      expect(computaMarcacaoService.processar).toHaveBeenNthCalledWith(2, expect.objectContaining({
        contextoMarcacao: [res1] 
      }));

      expect(result).toHaveLength(2);
      expect(tipoMarcacaoRepoMock.save).toHaveBeenCalledWith([res1, res2]);
    });

    it('deve processar corretamente sequencia complexa de um dia (Caso GERSINO)', async () => {
      // Data: 03/02/2026
      // Times: 05:52, 12:20, 13:04, 14:22
      const dateStr = '2026-02-03';
      const t1 = new Date(`${dateStr}T05:52:00`);
      const t2 = new Date(`${dateStr}T12:20:00`);
      const t3 = new Date(`${dateStr}T13:04:00`);
      const t4 = new Date(`${dateStr}T14:22:00`);

      const dto: ResPontoRegistroDTO[] = [
        { id: 101, mat: '000256', dataHoraAr: t1 } as any,
        { id: 102, mat: '000256', dataHoraAr: t2 } as any,
        { id: 103, mat: '000256', dataHoraAr: t3 } as any,
        { id: 104, mat: '000256', dataHoraAr: t4 } as any,
      ];

      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
      (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue([]); // No history in DB for this window

      // Mock finding the entity for each ID
      (registroPontoEntityRepoMock.findOne as jest.Mock).mockImplementation(async (opts) => {
        const id = opts.where.id;
        const foundDto = dto.find(d => d.id === id);
        return foundDto ? { ...foundDto } : null;
      });

      // Mock Service to act as a simple state machine based on context
      (computaMarcacaoService.processar as jest.Mock).mockImplementation(async ({ pontos, contextoMarcacao }) => {
        // Simple logic:
        // Empty -> 1E
        // Top is 1E -> 1S
        // Top is 1S -> 2E
        // Top is 2E -> 2S
        let resultMarcacao = 'XX';
        if (!contextoMarcacao || contextoMarcacao.length === 0) {
          resultMarcacao = '1E';
        } else {
          const last = contextoMarcacao[0].marcacao;
          if (last === '1E') resultMarcacao = '1S';
          else if (last === '1S') resultMarcacao = '2E';
          else if (last === '2E') resultMarcacao = '2S';
        }
        
        // CRITICAL: Return registroPonto so the loop logic (gap check) works for the NEXT item
        return { 
          marcacao: resultMarcacao,
          registroPonto: pontos // Pass back the input point as the associated registry
        };
      });

      const result = await useCase.processa(dto);

      expect(computaMarcacaoService.processar).toHaveBeenCalledTimes(4);

      // Verify results
      expect(result).toHaveLength(4);
      expect(result[0].marcacao).toBe('1E');
      expect(result[1].marcacao).toBe('1S');
      expect(result[2].marcacao).toBe('2E');
      expect(result[3].marcacao).toBe('2S');

      // Verify Context Passing for the 3rd point (where user said it fails)
      // Call 3 (index 2) is for 13:04. Context should include [1S (12:20), 1E (05:52)]
      const call3Args = (computaMarcacaoService.processar as jest.Mock).mock.calls[2][0];
      const context3 = call3Args.contextoMarcacao;
      expect(context3).toHaveLength(2);
      expect(context3[0].marcacao).toBe('1S');
      expect(context3[1].marcacao).toBe('1E');
    });

    it('deve gerar sequencia quebrada (1E, 1E, 1S) se houver Gap de Turno falso (Simulacao de Timezone/Delay)', async () => {
      // Cenário:
      // 05:00 -> 1E
      // 15:00 -> 12:00 (Gap de 10h) -> Deve resetar para 1E
      // 16:00 -> 13:00 (Gap de 1h) -> Deve ser 1S (baseado no novo 1E)
      
      const t1 = new Date('2026-02-03T05:00:00');
      const t2 = new Date('2026-02-03T15:00:00'); // 10h after t1
      const t3 = new Date('2026-02-03T16:00:00');

      const dto: ResPontoRegistroDTO[] = [
        { id: 201, mat: '999', dataHoraAr: t1 } as any,
        { id: 202, mat: '999', dataHoraAr: t2 } as any,
        { id: 203, mat: '999', dataHoraAr: t3 } as any,
      ];

      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
      (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue([]);
      (registroPontoEntityRepoMock.findOne as jest.Mock).mockImplementation(async (opts) => {
        const id = opts.where.id;
        const foundDto = dto.find(d => d.id === id);
        return foundDto ? { ...foundDto } : null;
      });

      // Same Mock Service
      (computaMarcacaoService.processar as jest.Mock).mockImplementation(async ({ pontos, contextoMarcacao }) => {
        let resultMarcacao = 'XX';
        if (!contextoMarcacao || contextoMarcacao.length === 0) {
          resultMarcacao = '1E';
        } else {
          const last = contextoMarcacao[0].marcacao;
          if (last === '1E') resultMarcacao = '1S';
          else if (last === '1S') resultMarcacao = '2E';
          else if (last === '2E') resultMarcacao = '2S';
        }
        return { marcacao: resultMarcacao, registroPonto: pontos };
      });

      const result = await useCase.processa(dto);

      // Expectation: 1E, 1E, 1S
      expect(result[0].marcacao).toBe('1E');
      
      // Gap triggered here (10h > 9h)
      expect(result[1].marcacao).toBe('1E'); 
      
      // Context for 3rd point is [1E (from t2)]. Length 1.
      expect(result[2].marcacao).toBe('1S');
    });

    it('deve processar corretamente múltiplos colaboradores sem contaminação de contexto (Correção de Bug)', async () => {
      // Cenário:
      // Func A: 08:00 (1E)
      // Func B: 08:05 (1E)
      // Func A: 12:00 (Deve ser 1S, ignorando o 1E do Func B)
      
      const tA1 = new Date('2026-02-03T08:00:00');
      const tB1 = new Date('2026-02-03T08:05:00');
      const tA2 = new Date('2026-02-03T12:00:00');

      const dto: ResPontoRegistroDTO[] = [
        { id: 301, mat: 'FUNC_A', dataHoraAr: tA1 } as any,
        { id: 302, mat: 'FUNC_B', dataHoraAr: tB1 } as any,
        { id: 303, mat: 'FUNC_A', dataHoraAr: tA2 } as any,
      ];

      (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
      (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue([]);
      (registroPontoEntityRepoMock.findOne as jest.Mock).mockImplementation(async (opts) => {
        const id = opts.where.id;
        const foundDto = dto.find(d => d.id === id);
        return foundDto ? { ...foundDto } : null;
      });

      // Use Standard Logic Mock
      (computaMarcacaoService.processar as jest.Mock).mockImplementation(async ({ pontos, contextoMarcacao }) => {
        // Assert that context is CLEAN (only contains same MAT)
        if (contextoMarcacao && contextoMarcacao.length > 0) {
             const dirty = contextoMarcacao.some(c => c.registroPonto.mat !== pontos.mat);
             if (dirty) {
                 return { marcacao: 'CONTAMINATED', registroPonto: pontos };
             }
        }

        let resultMarcacao = '1E';
        if (contextoMarcacao && contextoMarcacao.length > 0) {
          const last = contextoMarcacao[0].marcacao;
          if (last === '1E') resultMarcacao = '1S';
          else if (last === '1S') resultMarcacao = '2E';
          else if (last === '2E') resultMarcacao = '2S';
        }
        
        return { marcacao: resultMarcacao, registroPonto: pontos };
      });

      const result = await useCase.processa(dto);

      // A1 -> 1E
      expect(result[0].registroPonto.mat).toBe('FUNC_A');
      expect(result[0].marcacao).toBe('1E');

      // B1 -> 1E
      expect(result[1].registroPonto.mat).toBe('FUNC_B');
      expect(result[1].marcacao).toBe('1E');

      // A2 -> Should be 1S (Sequence: 1E -> 1S)
      // Since we fixed the code, context should only have A1(1E).
      expect(result[2].registroPonto.mat).toBe('FUNC_A');
      expect(result[2].marcacao).toBe('1S'); 
    });

    it('deve isolar o contexto por matricula (Teste de Correção)', async () => {
        const tA1 = new Date('2026-02-03T08:00:00');
        const tB1 = new Date('2026-02-03T08:05:00');
        const tB2 = new Date('2026-02-03T12:00:00');
        const tA2 = new Date('2026-02-03T12:05:00'); // Should match A1
  
        const dto: ResPontoRegistroDTO[] = [
          { id: 401, mat: 'FUNC_A', dataHoraAr: tA1 } as any,
          { id: 402, mat: 'FUNC_B', dataHoraAr: tB1 } as any,
          { id: 403, mat: 'FUNC_B', dataHoraAr: tB2 } as any,
          { id: 404, mat: 'FUNC_A', dataHoraAr: tA2 } as any,
        ];
  
        (tipoMarcacaoRepoMock.exist as jest.Mock).mockResolvedValue(false);
        (tipoMarcacaoRepoMock.find as jest.Mock).mockResolvedValue([]);
        (registroPontoEntityRepoMock.findOne as jest.Mock).mockImplementation(async (opts) => {
          const id = opts.where.id;
          const foundDto = dto.find(d => d.id === id);
          return foundDto ? { ...foundDto } : null;
        });
  
        // Standard State Machine Logic
        (computaMarcacaoService.processar as jest.Mock).mockImplementation(async ({ pontos, contextoMarcacao }) => {
            // Verify Contamination:
            if (contextoMarcacao.some(c => c.registroPonto.mat !== pontos.mat)) {
                // Return garbage to force test failure if contamination happens
                return { marcacao: 'CONTAMINATED', registroPonto: pontos };
            }

            let resultMarcacao = '1E';
            if (contextoMarcacao && contextoMarcacao.length > 0) {
              const last = contextoMarcacao[0].marcacao;
              if (last === '1E') resultMarcacao = '1S';
              else if (last === '1S') resultMarcacao = '2E';
              else if (last === '2E') resultMarcacao = '2S';
            }
            return { marcacao: resultMarcacao, registroPonto: pontos };
        });
  
        const result = await useCase.processa(dto);
        
        // A1
        expect(result[0].marcacao).toBe('1E');
        // B1
        expect(result[1].marcacao).toBe('1E');
        // B2 (1E -> 1S)
        expect(result[2].marcacao).toBe('1S');
        
        // A2
        // If contaminated by B: Context [B2(1S), B1(1E), A1(1E)] -> Slice [B2, B1] -> Last 1S -> 2E or CONTAMINATED
        // If Correct: Context [A1(1E)] -> Last 1E -> 1S
        expect(result[3].registroPonto.mat).toBe('FUNC_A');
        expect(result[3].marcacao).toBe('1S');
      });

    describe('Tratamento de Erros', () => {
      it('deve fazer rollback e lançar RpcException se erro for NJS-040 (Timeout)', async () => {
        (tipoMarcacaoRepoMock.exist as jest.Mock).mockRejectedValue(new Error('NJS-040: Connection timeout'));

        const dto: ResPontoRegistroDTO[] = [{ id: 1, mat: '123', dataHoraAr: new Date() } as any];

        await expect(useCase.processa(dto)).rejects.toThrow(RpcException);
        
        expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunnerMock.release).toHaveBeenCalled();
        expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('Erro de banco detectado'));
      });

      it('deve fazer rollback e lançar RpcException se erro for ORA- (Oracle)', async () => {
        (tipoMarcacaoRepoMock.exist as jest.Mock).mockRejectedValue(new Error('ORA-12154: TNS:could not resolve'));

        const dto: ResPontoRegistroDTO[] = [{ id: 1, mat: '123', dataHoraAr: new Date() } as any];

        await expect(useCase.processa(dto)).rejects.toThrow(RpcException);
        expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
      });

      it('deve fazer rollback e relançar erro genérico', async () => {
        const error = new Error('Erro inesperado de lógica');
        (tipoMarcacaoRepoMock.exist as jest.Mock).mockRejectedValue(error);

        const dto: ResPontoRegistroDTO[] = [{ id: 1, mat: '123', dataHoraAr: new Date() } as any];

        await expect(useCase.processa(dto)).rejects.toThrow(error);
        expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
        // Logger.error is called with (message, stack)
        expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('Erro fatal'), expect.anything());
      });
    });
  });
});
