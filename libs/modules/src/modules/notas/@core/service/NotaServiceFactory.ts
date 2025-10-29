import { Inject, Logger } from "@nestjs/common";
import { NotasServicesAvaiable } from "../../NotaServices.provider";
import { IGeracaoNota } from "../interface/IGeracaoNota";

export class NotaServiceFactory {

    constructor(
        @Inject(NotasServicesAvaiable) private geradoresNotas: IGeracaoNota[]
    ) {
        Logger.debug(`Notas disponíveis ${geradoresNotas.map(
            a => a.identificador().toString()
        ).join(',\n')}`)
    }

    public buildNota(props: { identificador: Symbol }): IGeracaoNota {
        const { identificador } = props;
        const estrategiaAlvo = this.geradoresNotas
            .find(gerador => gerador.identificador().toString() === identificador.toString());
        if (!estrategiaAlvo) throw new Error('Estrategia não registrada como gerador de nota');
        return estrategiaAlvo;
    }
}