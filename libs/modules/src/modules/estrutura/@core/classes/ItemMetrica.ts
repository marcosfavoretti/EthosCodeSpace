export class ItemMetrica {
  constructor(
    private _props: {
      nome: string;
      valor: string;
    },
  ) {}

  get props() {
    return structuredClone(this.props);
  }
}
