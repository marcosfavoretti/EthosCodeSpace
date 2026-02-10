import { Inject, Logger } from '@nestjs/common';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { MetodoDeAlocacao } from '../abstract/MetodoDeAlocacao';
import { MetodoDeReAlocacao } from '../abstract/MetodoDeReAlocacao';
import { SetorService } from '../abstract/SetorService';

export class SetorSolda extends SetorService {
  constructor(
    @Inject(MetodoDeAlocacao) private _metododeAlocacao: MetodoDeAlocacao,
    @Inject(MetodoDeReAlocacao) private _metodoDeReAlocacao: MetodoDeReAlocacao,
  ) {
    super(CODIGOSETOR.SOLDA, _metododeAlocacao, _metodoDeReAlocacao);
  }

  public cloneSetorService(): SetorService {
    return new SetorSolda(this._metododeAlocacao, this._metodoDeReAlocacao);
  }
}
