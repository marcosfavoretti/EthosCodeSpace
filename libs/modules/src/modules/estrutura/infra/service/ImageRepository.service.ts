import { ConfigService } from '@nestjs/config';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { IStorageService } from '@app/modules/modules/storage/@core/interfaces/IStorage.service';

export class ImagemEstruturaRepositoryService {
  constructor(
    @Inject(ConfigService) private configservice: ConfigService,
    @Inject(IStorageService) private storageService: IStorageService,
  ) {}

  async findOne(item: string): Promise<Buffer> {
    const imagesAvaiable = await this.storageService.list('');
    // Logger.debug(imagesAvaiable);
    const [frstImageTarget] = imagesAvaiable.filter(
      (filename) => filename.indexOf(item.trim()) !== -1,
    );
    if (!frstImageTarget)
      throw new NotFoundException('não foi encontrado a imagem da estrutura');
    return await this.storageService.get('', frstImageTarget);
  }

  async find(item: string): Promise<Buffer[]> {
    try {
      const imagesAvaiable = await this.storageService.list('');
      Logger.debug(imagesAvaiable);
      const imagensTargets = imagesAvaiable.filter(
        (filename) => filename.indexOf(item.trim()) !== -1,
      );

      const imagespath = imagensTargets.map((img) =>
        this.storageService.get('', img),
      );
      const imgs_buffers = await Promise.all(imagespath);
      //
      return imgs_buffers;
    } catch (error) {
      console.error('Erro ao ler o diretório:', error);
      throw new Error('Erro ao ler o diretório');
    }
  }
}
