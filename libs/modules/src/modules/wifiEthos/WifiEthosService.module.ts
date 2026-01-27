import { Module } from "@nestjs/common";
import { WifiEmailService } from "./infra/service/WifiEmail.service";
import { IObserverGerarWifiCode } from "./@core/interfaces/IObserverGerarWifiCode";
import { IWifiNotificacaoMagicLink } from "./@core/interfaces/IWifiNotificacao";
import { WifiCodeManagerRepository } from "./infra/repository/WifiCodeManager.repository";
import { WifiCodeMagicLinkRepository } from "./infra/repository/WifiCodeMagicLink.repository";
import { UbiquitiService } from "./infra/service/Ubiquiti.service";
import { UbiquitiAuthHeaders } from "./@core/classes/UbiquitiAuthHeaders";
import { UbiquitiAuthService } from "./infra/service/UbiquitiAuth.service";
import { EmailHttpClient } from "@app/modules/contracts/clients/EmailHttp.client";
import { UbiquitiHttpClient } from "@app/modules/contracts/clients/UbiquitiHttp.client";

@Module({
    imports: [],
    providers: [
        {
            provide: IObserverGerarWifiCode,
            useClass: WifiEmailService
        },
        {
            provide: IWifiNotificacaoMagicLink,
            useClass: WifiEmailService
        },
        EmailHttpClient,
        UbiquitiHttpClient,
        WifiCodeManagerRepository,
        WifiCodeMagicLinkRepository,
        UbiquitiService,
        UbiquitiAuthService,
    ],
    exports: [
        IWifiNotificacaoMagicLink,
        IObserverGerarWifiCode,
        WifiCodeManagerRepository,
        WifiCodeMagicLinkRepository,
        UbiquitiService,
        UbiquitiAuthService,
    ]
})
export class WifiEthosServiceModule {

}