import { Injectable, Logger } from "@nestjs/common";
import { IWifiNotificacaoMagicLink } from "../../@core/interfaces/IWifiNotificacao";
import { IObserverGerarWifiCode } from "../../@core/interfaces/IObserverGerarWifiCode";
import { WifiCodeManager } from "../../@core/entities/WifiCodeManager.entity";
import { EmailHttpClient } from "@app/modules/contracts/clients/EmailHttp.client";
import { EmailMagicLinkTemplate } from "../../template/EmailCodigoWifiMagicLink";
import { WifiRegisterLink } from "../../@core/classes/WifiRegisterLink";
import { ConfigService } from "@nestjs/config";
import { EmailCodigoWifiCadastradoTemplate } from "../../template/EmailCodigoWifiCadastrado";

@Injectable()
export class WifiEmailService implements
    IWifiNotificacaoMagicLink, IObserverGerarWifiCode {

    constructor(
        private configServicce: ConfigService,
        private emailHttpClient: EmailHttpClient
    ) { }

    onCreate(wifiManager: WifiCodeManager): Promise<void> {
        const adminEmail = this.configServicce.getOrThrow('ADMIN_EMAIL');
        const wifiSSID = this.configServicce.getOrThrow('WIFI_SSID');
        const emails = [wifiManager.visitanteEmail, wifiManager.ethosEmail, adminEmail];
        Logger.debug(`enviando email para ${emails.join(',')}`)
        return this.emailHttpClient.sendEmail({
            subject: `Codigo ${wifiManager.code} liberado para uso`,
            to: emails,
            html: EmailCodigoWifiCadastradoTemplate(wifiManager, wifiSSID),
            attachments: []
        })
    }

    sendNotificacao(props: { magicLink: WifiRegisterLink; toEmail: string; }): Promise<void> {
        return this.emailHttpClient.sendEmail({
            subject: 'Link para registro do codigo WIFI',
            to: [props.toEmail],
            html: EmailMagicLinkTemplate({
                employeeName: props.toEmail,
                magicLink: props.magicLink.getLink()
            }),
            attachments: [],
        })

    }

}