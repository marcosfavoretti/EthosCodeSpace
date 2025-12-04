export interface ITemplateBuilder {
  builin(props: { template: string; data: unknown }): Promise<string | Buffer>;
}
