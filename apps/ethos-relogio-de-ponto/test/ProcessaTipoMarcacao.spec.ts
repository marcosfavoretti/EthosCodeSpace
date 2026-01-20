import { ComputaMarcacaoService } from '@app/modules/modules/relogio-de-ponto/infra/services/ComputaMarcacao.service';
import { RegistroPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/RegistroPonto.entity';
import { parseISO, addHours, subHours } from 'date-fns';

describe(`teste para a classe ${ComputaMarcacaoService.name}`, () => {
  let service: ComputaMarcacaoService;

  beforeEach(() => {
    service = new ComputaMarcacaoService();
  });

  describe('dado um array com duas datas distintas com ranges de datas diferentes ele deve reprocessar registros', () => {
    it('deve processar assincronamente e criar novos períodos de marcação', async () => {
      const baseDate = parseISO('2023-10-26T08:00:00.000Z');

      const pontos: RegistroPonto[] = [
        // Primeiro período
        Object.assign(new RegistroPonto(), {
          id: 1,
          dataHoraAr: baseDate,
          nome: 'Funcionario 1',
        }),
        Object.assign(new RegistroPonto(), {
          id: 2,
          dataHoraAr: addHours(baseDate, 4), // 4 horas depois
          nome: 'Funcionario 1',
        }),
        // Segundo período (mais de 9 horas de diferença)
        Object.assign(new RegistroPonto(), {
          id: 3,
          dataHoraAr: addHours(baseDate, 10), // 10 horas depois do primeiro ponto
          nome: 'Funcionario 1',
        }),
        Object.assign(new RegistroPonto(), {
          id: 4,
          dataHoraAr: addHours(baseDate, 14), // 14 horas depois do primeiro ponto
          nome: 'Funcionario 1',
        }),
      ];

      const resultado = await service.processar({ pontos });

      expect(resultado).toHaveLength(4);

      // Primeiro período
      expect(resultado[0].marcacao).toBe('1E');
      expect(resultado[0].registroPonto.id).toBe(1);
      expect(resultado[1].marcacao).toBe('1S');
      expect(resultado[1].registroPonto.id).toBe(2);

      // Segundo período
      expect(resultado[2].marcacao).toBe('1E'); // Novo período, reinicia a contagem
      expect(resultado[2].registroPonto.id).toBe(3);
      expect(resultado[3].marcacao).toBe('1S');
      expect(resultado[3].registroPonto.id).toBe(4);
    });
  });

  describe('dado um array com dois registros de pontos em seguida ele deve processar', () => {
    it('deve processar sincronamente e continuar o mesmo período de marcação', async () => {
      const baseDate = parseISO('2023-10-26T08:00:00.000Z');

      const pontos: RegistroPonto[] = [
        Object.assign(new RegistroPonto(), {
          id: 1,
          dataHoraAr: baseDate,
          nome: 'Funcionario 2',
        }),
        Object.assign(new RegistroPonto(), {
          id: 2,
          dataHoraAr: addHours(baseDate, 1), // 1 hora depois
          nome: 'Funcionario 2',
        }),
        Object.assign(new RegistroPonto(), {
          id: 3,
          dataHoraAr: addHours(baseDate, 2), // 2 horas depois
          nome: 'Funcionario 2',
        }),
        Object.assign(new RegistroPonto(), {
          id: 4,
          dataHoraAr: addHours(baseDate, 3), // 3 horas depois
          nome: 'Funcionario 2',
        }),
      ];

      const resultado = await service.processar({ pontos });

      expect(resultado).toHaveLength(4);

      expect(resultado[0].marcacao).toBe('1E');
      expect(resultado[0].registroPonto.id).toBe(1);
      expect(resultado[1].marcacao).toBe('1S');
      expect(resultado[1].registroPonto.id).toBe(2);
      expect(resultado[2].marcacao).toBe('2E');
      expect(resultado[2].registroPonto.id).toBe(3);
      expect(resultado[3].marcacao).toBe('2S');
      expect(resultado[3].registroPonto.id).toBe(4);
    });
  });
});
