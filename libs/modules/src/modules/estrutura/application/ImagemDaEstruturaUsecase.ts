import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ImagemEstruturaRepositoryService } from '../infra/service/ImageRepository.service';

@Injectable()
export class ImagemDaEstruturaUsecase {
  @Inject(ImagemEstruturaRepositoryService)
  private imageRepositoryService: ImagemEstruturaRepositoryService;
  async getFile(name: string): Promise<Buffer> {
    try {
      const image: Buffer = await this.imageRepositoryService.findOne(name);
      if (!image)
        throw new NotFoundException('não foi possivel achar o arquivo');
      return image;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Falha ao buscar imagem da estrutura',
      );
    }
  }
}
