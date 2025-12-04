import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagemPack } from '../@core/entities/ImagemPack.entity';
import { GaleriaCreateImagePackDto } from '@app/modules/contracts/dto/CreateImagePack.dto';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { IStorageService } from '../../storage/@core/interfaces/IStorage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegisterImagePackUseCase {
  private galeriaPath: string;
  constructor(
    @InjectRepository(ImagemPack, 'mongo')
    private readonly imagemPack: Repository<ImagemPack>,
    @Inject(IStorageService) private readonly storageService: IStorageService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const path = this.configService.get<string>('GALERIA_PATH');
    if (!path) throw new Error('necessario do caminho da galeria!');
    this.galeriaPath = path;
  }

  async register(
    dto: GaleriaCreateImagePackDto,
    imagens: Array<Express.Multer.File>,
  ): Promise<ImagemPack> {
    try {
      const imagePaths = await Promise.all(
        imagens.map(async (imagem) => {
          const fileName = `${randomUUID()}${extname(imagem.originalname)}`;
          await this.storageService.save(
            this.galeriaPath,
            fileName,
            imagem.buffer,
          );
          return {
            path: this.galeriaPath,
            name: fileName,
          };
        }),
      );
      const imagePack = this.imagemPack.create({
        images: imagePaths,
        author: dto.author,
      });
      const result = await this.imagemPack.save(imagePack);
      Logger.log({ result });
      return result;
    } catch (error) {
      console.error('Erro:', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
