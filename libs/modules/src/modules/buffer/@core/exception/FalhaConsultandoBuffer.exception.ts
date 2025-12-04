import { InternalServerErrorException } from '@nestjs/common';

export class FalhaConsultandoBufferException extends InternalServerErrorException {
  constructor() {
    super('Falha ao consultar o buffer');
  }
}
