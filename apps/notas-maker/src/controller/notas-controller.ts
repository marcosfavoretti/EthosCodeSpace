import { CreateNotaReqDTO } from "@app/modules/contracts/dto/CreateNotaReq.dto";
import { GerarNotaUseCase } from "@app/modules/modules/notas/application/GerarNota.usecase";
import { Body, Controller, Inject, Post } from "@nestjs/common";

@Controller('/nota')
export class NotasController {
    @Inject(GerarNotaUseCase) private gerarNotaUseCase: GerarNotaUseCase;

    @Post()
    async gerarNotaMethod(@Body() dto: CreateNotaReqDTO): Promise<string> {
        return await this.gerarNotaUseCase.execute(dto);
    }
}