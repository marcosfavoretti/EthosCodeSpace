import { Inject } from '@nestjs/common';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';
import { MetodoDeAlocacao } from '../abstract/MetodoDeAlocacao';
import { MetodoDeReAlocacao } from '../abstract/MetodoDeReAlocacao';
import { SetorService } from '../abstract/SetorService';

export class SetorLixa extends SetorService {
  constructor(
    @Inject(MetodoDeAlocacao) private _metododealocacao: MetodoDeAlocacao,
    @Inject(MetodoDeReAlocacao) private _metodoDeReAlocacao: MetodoDeReAlocacao,
  ) {
    const setor = CODIGOSETOR.LIXA;
    super(setor, _metododealocacao, _metodoDeReAlocacao);
  }

  public cloneSetorService(): SetorService {
    return new SetorLixa(this._metododealocacao, this._metodoDeReAlocacao);
  }
}
