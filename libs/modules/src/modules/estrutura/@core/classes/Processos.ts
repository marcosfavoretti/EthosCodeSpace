export class Processos {
  constructor(
    private _operacao: string,
    private _qtd_tempo: number,
  ) {}

  get operacao() {
    return this._operacao;
  }

  get qtd_tempo() {
    return this._qtd_tempo;
  }
}
