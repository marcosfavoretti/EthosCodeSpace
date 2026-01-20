import { Inject } from '@nestjs/common';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { MetodoDeAlocacao } from '../abstract/MetodoDeAlocacao';
import { MetodoDeReAlocacao } from '../abstract/MetodoDeReAlocacao';
import { SetorService } from '../abstract/SetorService';

export class SetorPinturaPo extends SetorService {
  constructor(
    @Inject(MetodoDeAlocacao) private _metododeAlocacao: MetodoDeAlocacao,
    @Inject(MetodoDeReAlocacao) private _metodoDeReAlocacao: MetodoDeReAlocacao,
  ) {
    const setor = CODIGOSETOR.PINTURAPO;
    super(setor, _metododeAlocacao, _metodoDeReAlocacao);
  }
  public cloneSetorService(): SetorService {
    return new SetorPinturaPo(this._metododeAlocacao, this._metodoDeReAlocacao);
  }
}
