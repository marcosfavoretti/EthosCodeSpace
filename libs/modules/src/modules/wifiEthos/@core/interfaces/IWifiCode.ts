import { UbiquitiGenerateOptions } from "../classes/UbiquitiGenerateOptions";

export interface IWifiCode {
    generate(props: UbiquitiGenerateOptions): Promise<string>;
}