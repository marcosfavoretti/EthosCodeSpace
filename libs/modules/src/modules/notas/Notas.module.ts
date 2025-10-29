import { Module } from "@nestjs/common";
import { NotasServiceModule } from "./NotasService.module";
import { GerarNotaUseCase } from "./application/GerarNota.usecase";

@Module({
    imports: [NotasServiceModule],
    providers: [GerarNotaUseCase],
    exports: [GerarNotaUseCase]
})
export class NotasModule{}