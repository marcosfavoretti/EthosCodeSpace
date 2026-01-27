import { Module } from "@nestjs/common";
import { WifiEthosServiceModule } from "./WifiEthosService.module";
import { GerarCodigoWifiUseCase } from "./application/GerarCodigoWifi.usecase";
import { SolicitarCodigoWifiUseCase } from "./application/SolicitarCodigoWifi.usecase";
import { CheckarMagicLinkUseCase } from "./application/CheckarMagicLink.usecase";

@Module({
    imports: [WifiEthosServiceModule],
    providers: [GerarCodigoWifiUseCase, CheckarMagicLinkUseCase, SolicitarCodigoWifiUseCase],
    exports: [GerarCodigoWifiUseCase, CheckarMagicLinkUseCase, SolicitarCodigoWifiUseCase]
})
export class WifiEthosModule { }