export class ArquivoPontoDado {
  tipoIdentificador: 'CPF' | 'PIS';
  data: Date;
  identificador: string;

  constructor(props: ArquivoPontoDado) {
    Object.assign(this, props);
  }
}
