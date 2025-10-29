import { BadRequestException, Inject, NotFoundException, Injectable } from "@nestjs/common";
import { EstruturaRepository } from "../../../@logix/infra/repositories/Estrutura.repository";
import { Partcode } from "src/modules/shared/classes/Partcode";
import { EstruturaNotFound } from "../@core/exceptions/EstruturaNotFound";
import { EstruturaResponseListDTO } from "../../../@logix/infra/dto/EstruturaResponse.dto";
import { ItemDto } from "../../../@logix/infra/dto/Item.dto";

@Injectable()
export class GetEstruturaListaPorPartcodeUsecase {
    constructor(@Inject(EstruturaRepository) private readonly estruturaRepository: EstruturaRepository) { }

    async execute(partcode: Partcode): Promise<EstruturaResponseListDTO> {
        try {
            const estrutura = await this.estruturaRepository.getEstruturaAsList(partcode);
            if (!estrutura) throw new EstruturaNotFound(partcode.getPartcodeNum());
            const niveis = await this.estruturaRepository.getEstruturaDepth(partcode);
            console.log(estrutura)
            const response: ItemDto[] = estrutura.map(e=> ({ehControle:e.ehControle, itemCliente: e.itemCliente, partcode: e.partcode, status: e.status,qtd: e.qtd}));
            const listStruct: EstruturaResponseListDTO = {
                detalhes: {
                    niveis: niveis,
                    ultSync: new Date()
                },
                estrutura: response
            }
            return listStruct;
        } catch (error) {
            if (error instanceof EstruturaNotFound) {
                throw new NotFoundException(error.message);
            }
            console.log(error)
            throw new BadRequestException('Falha ao gerar a estrutura');
        }
    }
}