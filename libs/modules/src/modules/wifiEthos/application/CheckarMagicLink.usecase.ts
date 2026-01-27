import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { WifiCodeMagicLinkRepository } from "../infra/repository/WifiCodeMagicLink.repository";
import { ConsultaPorIdDto } from "@app/modules/contracts/dto/ConsultaPorId.dto";

@Injectable()
export class CheckarMagicLinkUseCase {
    constructor(private wifiCodeMagicLink: WifiCodeMagicLinkRepository) { }

    async execute(dto: ConsultaPorIdDto): Promise<boolean> {
        try {
            const { id } = dto;
            await this.wifiCodeMagicLink.findOneOrFail({
                where: {
                    parameter: id,
                    expire: false
                }
            });
            return true;
        } catch (error) {
            throw new BadRequestException('o id não é válido ou esta expirado');
        }
    }
}