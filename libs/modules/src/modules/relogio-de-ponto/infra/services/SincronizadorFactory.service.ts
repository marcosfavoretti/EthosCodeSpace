import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISincronizadorDePontos } from '../../@core/interfaces/ISincronizadorDePontos';
import { SincronizaRelogioPorArquivoService } from './SincronizaRelogioPorArquivo.service';
import { SincronizaRelogioService } from './SincronizaRelogio.service';

@Injectable()
export class SincronizadorFactory {
  constructor(private confService: ConfigService) { }

  createSincronizadores(): ISincronizadorDePontos[] {
    const mode = this.confService.get<string>('APP_MODE');
    const endpoints = this.confService.get<string[]>('RELOGIO_ENDPOINTS');

    if (!endpoints) {
      return [];
    }

    switch (mode?.toUpperCase()) {
      case 'DEV':
        const mock = new SincronizaRelogioPorArquivoService();
        Logger.debug(`observer para DEV MODE criado`);
        return [mock];
      case 'PROD':
        const syncService = endpoints.map(endpoint => {
          const service = new SincronizaRelogioService(this.confService);
          service.setBaseUrl({ baseUrl: endpoint });
          Logger.debug(`observer para ${endpoint} criado`);
          return service;
        })
        return syncService;
      default:
        throw new Error(
          'O contexto (modo) da aplicação precisa ser definido',
        );
    }
  }
}
