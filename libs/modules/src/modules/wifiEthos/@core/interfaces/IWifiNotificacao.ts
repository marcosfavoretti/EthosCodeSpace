import { WifiRegisterLink } from "../classes/WifiRegisterLink";

export const IWifiNotificacaoMagicLink = Symbol('IWifiNotificacaoMagicLink');
export interface IWifiNotificacaoMagicLink {
    sendNotificacao(props: {
        magicLink: WifiRegisterLink,
        toEmail: string
    }): Promise<void>;
}