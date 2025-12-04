import { __NotaAlmox } from '../consts/symbols';
import { Nota } from './Nota';

export class NotaAlmox extends Nota {
  constructor() {
    super(__NotaAlmox);
  }
}
