import { Injectable } from '@nestjs/common';

@Injectable()
export class EthosProducaoService {
  getHello(): string {
    return 'Hello World!';
  }
}
