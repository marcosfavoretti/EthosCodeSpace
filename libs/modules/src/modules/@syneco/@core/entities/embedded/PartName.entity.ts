export class PartName {
  public revision: string;
  public itemCliente: string;
  public description: string;
  constructor(public data: string) {
    const [itemCliente, revision, ...description] = data.split(' ');
    this.description = Array.isArray(description)
      ? description.join(' ')
      : description;
    this.itemCliente = itemCliente.trim();
    this.revision = revision.trim().replace('#', 'R');
  }
}
