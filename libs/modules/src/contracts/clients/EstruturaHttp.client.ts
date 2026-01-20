import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as axios from 'axios';

@Injectable()
export class EstruturaHttpClient {
  private estruturaClient: Axios.AxiosInstance;
  constructor(private configService: ConfigService) {
    this.estruturaClient = axios.create({
      baseURL: this.configService.get<string>('ESTRUTURA_SERVICE_URL'),
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      timeout: 5000,
    });
  }

  async buscarItemDeControle(props: { partcode: string }): Promise<string[]> {
    const { data } = await this.client.get<{ partcode: string }[]>(
      '/estrutura/controle',
      {
        params: props,
      },
    );
    return data.map((d) => d.partcode);
  }

  get client() {
    return this.estruturaClient;
  }
}
