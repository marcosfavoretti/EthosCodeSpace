import { Injectable } from '@nestjs/common';
import { NotaAlmox } from '../classes/NotaAlmox';
import { NotaInventarioAlmox } from '../classes/NotaInventarioAlmox';
import { Nota } from '../classes/Nota';
import { CreateInventarioNotaReqDTO } from '@app/modules/contracts/dto/CreateInventarioNotaReq.dto';
import {
  __InventarioAlmox,
  __NotaAlmox,
  __NotaPdiEtiqueta,
} from '../consts/symbols';
import { NotaPDIEtiqueta } from '../classes/NotaPdiEtiqueta';
import { CreateNotaPdiEtiquetaDTO } from '@app/modules/contracts/dto/CreateNotaPdiEtiqueta.dto';

@Injectable()
export class NotaPayloadFactory {
  /**
   * Cria uma instância de payload de domínio a partir dos dados brutos do DTO.
   */
  public create(props: { tipo: string; payload: unknown[] }): Nota[] {
    const { tipo, payload } = props;

    switch (Symbol(tipo).toString()) {
      case __NotaAlmox.toString():
        return [new NotaAlmox()];

      case __NotaPdiEtiqueta.toString():
        const payloadCastPDI = payload as CreateNotaPdiEtiquetaDTO[];
        const notasPDI = payloadCastPDI.map(
          (pay) => new NotaPDIEtiqueta(pay.serialNumber, pay.orderNum),
        );
        console.log(`nota pdi: ${JSON.stringify(notasPDI)}`);
        return notasPDI;

      case __InventarioAlmox.toString():
        const payloadCast = payload as CreateInventarioNotaReqDTO[];
        const notas = payloadCast.map(
          (pay) =>
            new NotaInventarioAlmox(
              pay.id,
              pay.cod_item,
              pay.cod_local_estoq,
              pay.den_item_reduz,
            ),
        );

        return notas;

      default:
        throw new Error(`Tipo de nota desconhecido: ${tipo}`);
    }
  }
}
