import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { UbiquitiService } from "../infra/service/Ubiquiti.service";
import { GerarCodigoWifiDTO } from "@app/modules/contracts/dto/GerarCodigoWifi.dto";
import { WifiCodeManagerRepository } from "../infra/repository/WifiCodeManager.repository";
import { WifiCodeMagicLinkRepository } from "../infra/repository/WifiCodeMagicLink.repository";
import { ConfigService } from "@nestjs/config";
import { WifiVoucherName } from "../@core/classes/WifiVoucherName";
import { WifiCodeManager } from "../@core/entities/WifiCodeManager.entity";
import { IObserverGerarWifiCode } from "../@core/interfaces/IObserverGerarWifiCode";
import { EntityNotFoundError } from "typeorm";
import { ConsultaPorIdDto } from "@app/modules/contracts/dto/ConsultaPorId.dto";
import { ExpireMagicLinkException } from "../@core/exception/ExpireMagicLink.exception";

@Injectable()
export class GerarCodigoWifiUseCase {
    constructor(
        @Inject(IObserverGerarWifiCode) private observer: IObserverGerarWifiCode,
        private wifiCodeLinkRepo: WifiCodeMagicLinkRepository,
        private wifiCodeManagerRepo: WifiCodeManagerRepository,
        private ubiquitiService: UbiquitiService,
        private configService: ConfigService
    ) { }
    async execute(dto: GerarCodigoWifiDTO & ConsultaPorIdDto): Promise<string> {
        const { visitanteEmail, visitanteEmpresa, id, visitanteNome } = dto;
        const wifiTimelimit = this.configService.getOrThrow('WIFI_TIME_LIMIT_MINUTES');
        const voucher = new WifiVoucherName({
            visitanteEmpresa,
            visitanteNome,
        });
        try {
            Logger.log(id)
            //procura no banco quem triggou a acao
            const triggedUser = await this.wifiCodeLinkRepo.findOneOrFail({
                where: {
                    parameter: id
                }
            });
            if (triggedUser.expire) throw new ExpireMagicLinkException();
            //
            //gera o codigo wifi 
            const codigo = await this.ubiquitiService.generate({
                cmd: 'create-voucher',
                n: 1,
                quota: 1,
                note: voucher.getVoucher(),
                expire_number: wifiTimelimit,
                expire_unit: 1,
            });

            //
            //salva no banco a relacao token e visita
            const wifiCodeManager = new WifiCodeManager({
                ethosEmail: triggedUser?.email,
                visitanteEmail,
                visitanteEmpresa,
                visitanteNome,
                code: codigo
            });

            Logger.debug(`codigo wifi gerado ${codigo}`);
            await this.wifiCodeManagerRepo.save(wifiCodeManager);
            await this.wifiCodeLinkRepo.save({
                ...triggedUser,
                expire: true
            });
            //rotorno do codigo wifi
            await this.observerExecute(wifiCodeManager);
            //
            return codigo;
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundException('O id informado não existe')
            }
            else if (error instanceof ExpireMagicLinkException) {
                throw error;
            }
            Logger.error(error, error.stack);
            throw new InternalServerErrorException('Não foi possível gerar o codigo wifi no momento.')
        }
    }

    private async observerExecute(wifiManger: WifiCodeManager): Promise<void> {
        try {
            await this.observer.onCreate(wifiManger);
        } catch (error) {
            Logger.error(error);
        }
    }
}