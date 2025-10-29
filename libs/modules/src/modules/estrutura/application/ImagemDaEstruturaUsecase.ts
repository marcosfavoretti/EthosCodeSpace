import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ImageRepositoryService } from "../infra/services/ImageRepository.service";
import { Image } from "src/modules/analises/@core/classes/Image";

@Injectable()
export class ImagemDaEstruturaUsecase  {
    @Inject(ImageRepositoryService) private imageRepositoryService: ImageRepositoryService;
    async getFile(name: string): Promise<Image> {
        const image = await this.imageRepositoryService.findOne(name)
        if(!image) throw new NotFoundException('não foi possivel achar o arquivo')
        return image;
    }
}