import { Injectable } from '@nestjs/common';
import { ArquivoPontoDado } from '../../@core/class/ArquivoPontoDado.entity';
import { ISincronizadorDePontos } from '../../@core/interfaces/ISincronizadorDePontos';
import { parse } from 'date-fns';

@Injectable()
export class MockRelogio implements ISincronizadorDePontos {
  async sincroniza(): Promise<ArquivoPontoDado[]> {
    return [
      new ArquivoPontoDado({
        data: new Date(),
        identificador: '1',
        tipoIdentificador: 'CPF',
      }),
      //Tue Nov 04 2025 15:51:00.000
      new ArquivoPontoDado({
        data: parse('04/11/2025 15:51:00', 'dd/MM/yyyy HH:mm:ss', new Date()),
        identificador: '2',
        tipoIdentificador: 'PIS',
      }),
      //Tue Nov 04 2025 15:51:00.000
      new ArquivoPontoDado({
        data: new Date(),
        identificador: '3',
        tipoIdentificador: 'PIS',
      }),
      //2025-10-31T18:50:00.000Z
      new ArquivoPontoDado({
        data: parse('31/10/2025 18:50:00', 'dd/MM/yyyy HH:mm:ss', new Date()),
        identificador: '4',
        tipoIdentificador: 'CPF',
      }),
      // //2025-11-05 12:13
      new ArquivoPontoDado({
        data: parse('05/11/2025 12:13:00', 'dd/MM/yyyy HH:mm:ss', new Date()),
        identificador: '5',
        tipoIdentificador: 'CPF',
      }),
    ];
  }
}
