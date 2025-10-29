import { CreateNotaReqDTO } from "@app/modules/contracts/dto/CreateNotaReq.dto";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { NotaPayloadFactory } from "../@core/service/NotaPayloadFactory";
import { NotaServiceFactory } from "../@core/service/NotaServiceFactory";

@Injectable()
export class GerarNotaUseCase {

    constructor(
        private notaServiceFabrica: NotaServiceFactory,
        private notaPayloadFabrica: NotaPayloadFactory
    ) { }

    async execute(dto: CreateNotaReqDTO): Promise<string> {
        try {
            const { payload, tipo } = dto;
            const nota = await this.notaPayloadFabrica.create({
                payload,
                tipo
            });
            const notaStrategy = this.notaServiceFabrica
                .buildNota({
                    identificador: nota[0].type
                });
            const { content, fileName } = await notaStrategy.gerar(nota);
            if (fileName) return fileName;
            return content instanceof Buffer ? content.toString() : content as string;
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}