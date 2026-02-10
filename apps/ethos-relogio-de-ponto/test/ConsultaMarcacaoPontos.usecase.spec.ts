
import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaMarcacaoPontosUseCase } from '../../../libs/modules/src/modules/relogio-de-ponto/application/ConsultaPontos.usecase';
import { CheckInvalidHours } from '../../../libs/modules/src/modules/relogio-de-ponto/@core/services/CheckInvalidHours';
import { TipoMarcacaoPontoRepository } from '../../../libs/modules/src/modules/relogio-de-ponto/infra/repository/TipoMarcacaoPonto.repository';
import { FuncinarioRepository } from '../../../libs/modules/src/modules/relogio-de-ponto/infra/repository/Funcionario.repository';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { Funcionario } from '../../../libs/modules/src/modules/relogio-de-ponto/@core/entities/Funcionarios.entity';
import { TipoMarcacaoPonto } from '../../../libs/modules/src/modules/relogio-de-ponto/@core/entities/TipoMarcacaoPonto.entity';
import { RegistroPonto } from '../../../libs/modules/src/modules/relogio-de-ponto/@core/entities/RegistroPonto.entity';
import { ConsultaMarcacaoDTO } from '@app/modules/contracts/dto/ConsultaMarcacao.dto';

describe('ConsultaMarcacaoPontosUseCase', () => {
  let useCase: ConsultaMarcacaoPontosUseCase;
  let tipoMarcacaoPontoRepository: TipoMarcacaoPontoRepository;
  let funcionarioRepository: FuncinarioRepository;

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getQueryAndParameters: jest.fn().mockReturnValue(['', []]),
    clone: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultaMarcacaoPontosUseCase,
        {
          provide: CheckInvalidHours,
          useValue: {
            checkInvalidHours: jest.fn().mockReturnValue(false),
          },
        },
        {
          provide: TipoMarcacaoPontoRepository,
          useValue: {
            createQueryBuilder: jest.fn(() => mockQueryBuilder), // Added this line
            manager: {
              createQueryBuilder: jest.fn(() => mockQueryBuilder),
              query: jest.fn(),
            },
          },
        },
        {
          provide: FuncinarioRepository,
          useValue: {
            buscarPoridentificador: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
      ],
    }).compile();

    useCase = module.get<ConsultaMarcacaoPontosUseCase>(
      ConsultaMarcacaoPontosUseCase,
    );
    tipoMarcacaoPontoRepository = module.get<TipoMarcacaoPontoRepository>(
      TipoMarcacaoPontoRepository,
    );
    funcionarioRepository = module.get<FuncinarioRepository>(
      FuncinarioRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly group night shift punches into a single workday', async () => {
    // 1. Setup Mock Data
    const matricula = '000000';
    const nome = 'WILLIAN';
    const turnoDia = new Date('2026-02-03T00:00:00.000Z');

    const mockPunches: Partial<TipoMarcacaoPonto>[] = [
      {
        id: 0,
        marcacao: '1E',
        registroPonto: { dataHoraAr: new Date('2026-02-03T03:08:00Z'), mat: matricula, nome } as RegistroPonto,
      },
      {
        id: 1,
        marcacao: '1S',
        registroPonto: { dataHoraAr: new Date('2026-02-03T05:56:00Z'), mat: matricula, nome } as RegistroPonto,
      },
      {
        id: 2,
        marcacao: '1E',
        registroPonto: { dataHoraAr: new Date('2026-02-04T01:36:00Z'), mat: matricula, nome } as RegistroPonto,
      },
      {
        id: 3,
        marcacao: '1S',
        registroPonto: { dataHoraAr: new Date('2026-02-04T03:10:00Z'), mat: matricula, nome } as RegistroPonto,
      },
      {
        id: 4,
        marcacao: '2E',
        registroPonto: { dataHoraAr: new Date('2026-02-04T03:48:00Z'), mat: matricula, nome } as RegistroPonto,
      },
      // This punch is outside the user's example, but necessary to test the 6 AM cutoff
      {
        id: 5,
        marcacao: '2S', // Assuming another exit punch for simplicity
        registroPonto: { dataHoraAr: new Date('2026-02-04T07:59:00Z'), mat: matricula, nome } as RegistroPonto,
      }
    ];

    const mockFuncionario: Partial<Funcionario> = {
      matricula,
      nome,
      centroDeCusto: { descricao: 'DOBRADEIRA' } as any,
    };

    // 2. Mock Repository and Query Builder Responses

    // Mock for executeTotalCount
    (tipoMarcacaoPontoRepository.manager.query as jest.Mock).mockResolvedValueOnce([
      { total: 1 },
    ]);

    // Mock for fetchPaginatedKeys
    (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValueOnce([
      { matricula, dataturno: turnoDia },
    ]);

    // Mock for fetchFullDataByTimeRange
    (mockQueryBuilder.getMany as jest.Mock).mockResolvedValueOnce(mockPunches);

    // Mock for fetchEmployeeDetails
    (funcionarioRepository.buscarPoridentificador as jest.Mock).mockResolvedValueOnce([
      mockFuncionario,
    ]);

    // 3. Execute the Use Case
    const dto: ConsultaMarcacaoDTO = {
      indetificador: matricula,
    };
    const result = await useCase.consulta(dto);

    console.log(result)
    // 4. Assertions
    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(2);

    const workdayResult = result.data[0];
    expect(result.data.length).toBe(2);
    expect(workdayResult.matricula).toBe(matricula);
    expect(workdayResult.nome).toBe(nome);
    expect(workdayResult.turnoDiaStr).toBe('03/02/2026');
    expect(workdayResult.registros).toHaveLength(4);
    expect(result.data[1].registros).toHaveLength(2);

    const pontos = result.data.flatMap((item) => item.registros);
    // Verify that all punches are correctly included and ordered
    console.log(pontos)

    expect(pontos[4].marcacao).toBe('1E');

    expect(pontos[5].marcacao).toBe('1S');

    expect(pontos[0].marcacao).toBe('1E');

    expect(pontos[1].marcacao).toBe('1S');

    expect(pontos[2].marcacao).toBe('2E');

    expect(pontos[3].marcacao).toBe('2S');

  });
});
