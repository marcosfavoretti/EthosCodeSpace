import { __NotaPdiEtiqueta } from '../consts/symbols';
import { Nota } from './Nota';

export class NotaPDIEtiqueta extends Nota {
  private datamatrixImageBase64: string;
  private datamatrixValue: string;

  constructor(
    private serialNumber: string,
    private ordemNum: string,
  ) {
    super(__NotaPdiEtiqueta);
    this.datamatrixValue = ordemNum.concat(serialNumber);
  }

  get getDataMatrixValue() {
    return this.datamatrixValue;
  }

  set set_datamatrixImageBase64(value: string) {
    this.datamatrixImageBase64 = value;
  }

  get getOrdemNum() {
    return this.ordemNum;
  }
}
