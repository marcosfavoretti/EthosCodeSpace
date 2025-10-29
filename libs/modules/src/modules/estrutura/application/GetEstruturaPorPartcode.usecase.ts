import { BadRequestException, Inject, NotFoundException, Injectable } from "@nestjs/common";
import { EstruturaNotFound } from "../@core/exceptions/EstruturaNotFound";

@Injectable()
export class GetEstruturaPorPartcodeUsecase {
    constructor(@Inject(EstruturaRepository) private readonly estruturaRepository: EstruturaRepository) { }

    
    async execute(partcode: Partcode): Promise<EstruturaResponseTreeDTO> {
        try {
            const estrutura: EstruturaDto | undefined = await this.estruturaRepository.getEstrutura(partcode);
            const niveis = await this.estruturaRepository.getEstruturaDepth(partcode);
            if (!estrutura) throw new EstruturaNotFound(partcode.getPartcodeNum());
            const listStruct: EstruturaResponseTreeDTO = {
                detalhes: {
                    niveis: niveis,
                    ultSync: new Date()
                },
                estrutura: estrutura
            }
            return listStruct;
        } catch (error) {
            if (error instanceof EstruturaNotFound) {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Falha ao gerar a estrutura');
        }
    }
}