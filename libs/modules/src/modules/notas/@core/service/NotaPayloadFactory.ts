import { Injectable } from "@nestjs/common";
import { NotaAlmox } from "../classes/NotaAlmox";
import { __NotaAlmox } from "./AlmoxNota.service";
import { __InventarioAlmox } from "./InventarioAlmox.service";
import { NotaInventarioAlmox } from "../classes/NotaInventarioAlmox";
import { Nota } from "../classes/Nota";
import { CreateInventarioNotaReqDTO } from "@app/modules/contracts/dto/CreateInventarioNotaReq.dto";

@Injectable()
export class NotaPayloadFactory {
    /**
     * Cria uma instância de payload de domínio a partir dos dados brutos do DTO.
     */
    public create(props: { tipo: string, payload: unknown[] }): Nota[] {
        const { tipo, payload } = props;
        switch (Symbol(tipo).toString()) {
            case __NotaAlmox.toString():
                return [new NotaAlmox()];

            case __InventarioAlmox.toString():
                const payloadCast = payload as CreateInventarioNotaReqDTO[];
                return payloadCast
                    .map(pay => new NotaInventarioAlmox(
                        pay.id,
                        pay.cod_item,
                        pay.cod_local_estoq,
                        pay.den_item_reduz
                    ));

            default:
                throw new Error(`Tipo de nota desconhecido: ${tipo}`);
        }
    }
}