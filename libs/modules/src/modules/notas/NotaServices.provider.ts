import { Provider } from "@nestjs/common";
import { AlmoxNotaService } from "./@core/service/AlmoxNota.service";
import { InventarioAlmoxService } from "./@core/service/InventarioAlmox.service";

export const NotasServicesAvaiable = Symbol('NotasServicesAvaiable');

export const NotaServicesProviders: Provider = {
    provide: NotasServicesAvaiable,
    useFactory: (almn: AlmoxNotaService, invalm: InventarioAlmoxService) => [almn, invalm],
    inject: [AlmoxNotaService, InventarioAlmoxService]
}