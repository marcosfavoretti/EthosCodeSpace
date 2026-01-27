import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { UbiquitiService } from "../infra/service/Ubiquiti.service";
import { SolicitarCodigoWifiDTO } from "@app/modules/contracts/dto/SolicitarCodigoWifi.dto";
import { EmailHttpClient } from "@app/modules/contracts/clients/EmailHttp.client";
import { EmailMagicLinkTemplate } from "../template/EmailCodigoWifiMagicLink";
import { ConfigService } from "@nestjs/config";
import { WifiCodeMagicLinkRepository } from "../infra/repository/WifiCodeMagicLink.repository";
import { randomUUID } from "crypto";
import { WifiRegisterLink } from "../@core/classes/WifiRegisterLink";
import { WifiCodeMagicLink } from "../@core/entities/WifiCodeMagicLink.entity";
import { IWifiNotificacaoMagicLink } from "../@core/interfaces/IWifiNotificacao";

@Injectable()
export class SolicitarCodigoWifiUseCase {
    constructor(
        @Inject(IWifiNotificacaoMagicLink) private wifiEmailNotifica: IWifiNotificacaoMagicLink,
        private wifiCodeMagicLinkRepository: WifiCodeMagicLinkRepository,
        private configService: ConfigService,
    ) { }

    async execute(dto: SolicitarCodigoWifiDTO): Promise<string> {
        const { email } = dto;

        const randomParameter = randomUUID();

        const serviceURI = this.configService.getOrThrow<string>('WIFI_CHECKOUT_URI');

        const registerLink = new WifiRegisterLink({
            serviceLink: serviceURI,
            randomParameter: randomParameter
        });

        const magicLinkEntity = new WifiCodeMagicLink({
            email: email,
            parameter: randomParameter
        });

        try {
            await this.wifiEmailNotifica.sendNotificacao({
                magicLink: registerLink,
                toEmail: email
            });
            
            await this.saveInDatabase(magicLinkEntity)

            Logger.log(`Link Wifi gerado com sucesso para: ${email}`);

            return randomParameter;
        } catch (error) {
            Logger.error(`Erro ao gerar código wifi para ${email}`, error.stack);
            throw new InternalServerErrorException('Não foi possível processar sua solicitação no momento.');
        }
    }

    private async saveInDatabase(entity: Partial<WifiCodeMagicLink>): Promise<WifiCodeMagicLink> {
        return this.wifiCodeMagicLinkRepository.save(entity);
    }


}