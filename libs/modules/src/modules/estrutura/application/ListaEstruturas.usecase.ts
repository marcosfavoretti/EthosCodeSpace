import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { EstruturaRepository } from "../../../@logix/infra/repositories/Estrutura.repository";
import { ItemDto } from "../../../@logix/infra/dto/Item.dto";

@Injectable()
export class ListaEstruturasUsecase {
    constructor(@Inject(EstruturaRepository) private estruturaRepository: EstruturaRepository) { }

    async listAll(): Promise<ItemDto[]> {
        try {
            return await this.estruturaRepository.listEstruturas();
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('problemas com o serviço');
        }
    }
}