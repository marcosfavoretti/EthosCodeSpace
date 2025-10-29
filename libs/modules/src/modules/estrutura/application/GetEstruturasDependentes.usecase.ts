import { BadRequestException, Inject, Logger, NotFoundException, Injectable } from "@nestjs/common";
import { EstruturaRepository } from "../../../@logix/infra/repositories/Estrutura.repository";
import { Partcode } from "src/modules/shared/classes/Partcode";
import { ItemDto } from "../../../@logix/infra/dto/Item.dto";
import { ItemDepedenciaDTO } from "../../../@logix/infra/dto/ItemDependencia.dto";
import { ItemNotFoundException } from "../@core/exceptions/ItemNotFound";

@Injectable()
export class GetEstruturasDependentesUsecase {
    @Inject(EstruturaRepository) private estruturaRepository: EstruturaRepository;

    async getdependentes(partcode: Partcode): Promise<ItemDepedenciaDTO> {
        try {
            const [dependentes, item] = await Promise.all([
                this.estruturaRepository.listEstruturasDependentes(partcode),
                this.estruturaRepository.getItem(partcode)
            ])
            if (!item) throw new ItemNotFoundException(partcode.getPartcodeNum());
            const itemDependencia: ItemDepedenciaDTO = {
                depedencias: dependentes,
                target: item
            }
            return itemDependencia;
        } catch (error) {
            if (error instanceof ItemNotFoundException) throw new NotFoundException(error.message);
            throw new BadRequestException('Erro ao buscar estruturas dependentes', error.message);
        }
    }
}