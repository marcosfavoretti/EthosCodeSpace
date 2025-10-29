import { Module } from "@nestjs/common";
import { EstruturaServiceModule } from "./EstruturaService.module";

@Module({
    imports: [EstruturaServiceModule],
    providers: [],
    exports: []
})
export class EstruturaModule { }