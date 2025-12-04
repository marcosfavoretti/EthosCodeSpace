import { PartSerialNumber } from '../entities/PartSerialNumber.entity';

export class PartSerialNumberBuilder {
  private props: Partial<PartSerialNumber>;

  // 1. O construtor é privado para forçar o uso do método estático `new()`
  private constructor() {
    this.props = {};

    // 2. Definir valores padrão inteligentes
    // Não definimos ID (auto-gerado) ou RegistryTimeStamp (auto-gerado)
    this.props.Exported = 0;
    this.props.AllowMultipleReports = 0; // Assumindo 0 como padrão
    this.props.UpdateTimeStamp = new Date(); // Definido no momento da construção
  }

  /**
   * Ponto de entrada estático para criar um novo builder.
   * @returns Um novo PartSerialNumberBuilder
   */
  public static new(): PartSerialNumberBuilder {
    return new PartSerialNumberBuilder();
  }

  // 3. Métodos "with" fluentes para definir cada propriedade
  public withSerialNumber(serialNumber: string): this {
    this.props.SerialNumber = serialNumber;
    return this;
  }

  public withPartCode(partCode: string): this {
    this.props.PartCode = partCode;
    return this;
  }

  public withLoweringPlace(loweringPlace: string): this {
    this.props.LoweringPlace = loweringPlace;
    return this;
  }

  public withWeight(weight: string): this {
    // Você pode adicionar lógica de conversão/validação aqui
    // ex: if (isNaN(parseFloat(weight))) throw new Error("Weight must be numeric");
    this.props.Weight = weight;
    return this;
  }

  public withAllowMultipleReports(allow: boolean | number): this {
    this.props.AllowMultipleReports =
      typeof allow === 'boolean' ? (allow ? 1 : 0) : allow;
    return this;
  }

  public withExported(exported: boolean | number): this {
    this.props.Exported =
      typeof exported === 'boolean' ? (exported ? 1 : 0) : exported;
    return this;
  }

  /**
   * Opcional: permite sobrescrever o timestamp de atualização padrão.
   */
  public withUpdateTimeStamp(date: Date): this {
    this.props.UpdateTimeStamp = date;
    return this;
  }

  // 4. O método build() finaliza o objeto
  /**
   * Constrói a instância final de PartSerialNumber.
   * @throws {Error} Se propriedades obrigatórias não forem fornecidas.
   * @returns {PartSerialNumber}
   */
  public build(): PartSerialNumber {
    // 5. Validação centralizada
    if (!this.props.SerialNumber) {
      throw new Error(
        'SerialNumber é obrigatório para construir PartSerialNumber.',
      );
    }
    if (!this.props.PartCode) {
      throw new Error(
        'PartCode é obrigatório para construir PartSerialNumber.',
      );
    }

    // Cria a instância da entidade real e atribui as propriedades
    const entity = new PartSerialNumber();
    Object.assign(entity, this.props);

    return entity;
  }
}
