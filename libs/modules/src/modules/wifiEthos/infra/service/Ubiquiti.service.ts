
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { IWifiCode } from '../../@core/interfaces/IWifiCode';
import { UbiquitiHttpClient } from '@app/modules/contracts/clients/UbiquitiHttp.client';
import { UbiquitiAuthService } from './UbiquitiAuth.service';
import { UbiquitiAuthHeaders } from '../../@core/classes/UbiquitiAuthHeaders';
import { UbiquitiGenerateOptions } from '../../@core/classes/UbiquitiGenerateOptions';
import { UbiquitiCodes } from '../../@core/classes/UbiquitiCodes';
import { WifiCodeManagerRepository } from '../repository/WifiCodeManager.repository';
import { In } from 'typeorm';

@Injectable()
export class UbiquitiService implements IWifiCode {
  constructor(
    private readonly http: UbiquitiHttpClient,
    private readonly wifiCodeManager: WifiCodeManagerRepository,
    private readonly authService: UbiquitiAuthService,
  ) { }

  async generate(props: UbiquitiGenerateOptions): Promise<string> {
    const authHeaders = await this.authService.getAuthHeaders();

    let code = await this.fetchFirstAvailableCode(authHeaders);

    if (code) {
      return code;
    }

    await this.createVoucher(authHeaders, props);

    //busca denovo
    code = await this.fetchFirstAvailableCode(authHeaders);

    if (!code) {
      throw new InternalServerErrorException('Voucher solicitado mas não encontrado na lista.');
    }

    return code;
  }

  private async fetchFirstAvailableCode(authHeader: UbiquitiAuthHeaders): Promise<string | null> {
    try {
      // 1. Busca TUDO da Ubiquiti
      const response = await this.http.client.get<{ data: UbiquitiCodes[] }>(
        '/api/s/default/stat/voucher',
        authHeader // Lembre-se: no axios GET, header é o 2º argumento.
      );

      const allVouchers = response.data.data;

      // 2. Filtra na memória APENAS os vouchers que a Ubiquiti diz que são válidos
      // Isso evita pegar voucher velho/expirado que não está no seu banco
      const validUnifiVouchers = allVouchers;

      if (validUnifiVouchers.length === 0) {
        console.warn('Nenhum voucher válido encontrado na controller Ubiquiti.');
        return null;
      }

      // Extrai apenas os códigos limpos (removendo traços se necessário, geralmente Unifi manda com traço)
      // Se seu banco salva sem traço, faça .replace(/-/g, '') aqui.
      const candidateCodes = validUnifiVouchers.map(v => v.code);

      // 3. Verifica no banco quais destes já foram "alocados" pelo seu sistema
      // IMPORTANTE: Se candidateCodes for GIGANTE, isso pode dar erro. 
      // Idealmente, limitamos a buscar, por exemplo, os primeiros 50 candidatos para não sobrecarregar.
      const batchToCheck = candidateCodes.slice(0, 50);

      const takenWificodes = await this.wifiCodeManager.find({
        where: {
          code: In(batchToCheck)
        },
        select: ['code'] // Traz só o campo code para economizar memória
      });

      const takenSet = new Set(takenWificodes.map(t => t.code));

      // 4. Filtra: O que é válido na Unifi E NÃO está no banco
      const availableCodes = batchToCheck.filter(code => !takenSet.has(code));

      if (availableCodes.length > 0) {
        // DICA: Retorna um aleatório da lista em vez do [0].
        // Isso diminui drasticamente a chance de "Race Condition" se 2 pessoas chamarem juntas.
        const randomIndex = Math.floor(Math.random() * availableCodes.length);
        return availableCodes[randomIndex];
      }

      return null;

    } catch (error) {
      console.error('Erro ao listar/filtrar vouchers:', error);
      // Opcional: Relançar erro ou retornar null depende da sua estratégia de resiliência
      return null;
    }
  }

  private async createVoucher(auth: UbiquitiAuthHeaders, options: UbiquitiGenerateOptions): Promise<void> {
    try {
      Logger.debug('criando o codigo no ubiquiti');
      await this.http.client.post('/api/s/default/cmd/hotspot', {
        cmd: options.cmd || 'create-voucher',
        quota: options.quota,
        note: options.note,
        n: 1, // Forçamos 1 por vez para controle
        expire: options.expire_number,
        expire_unit: options.expire_unit
      }, auth);
    } catch (error) {
      throw new InternalServerErrorException('Falha na comunicação com Unifi ao criar voucher');
    }
  }
}