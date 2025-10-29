export interface ITemplateLoader {
    load(props: { data: unknown[] }): Promise<string> | string;
}