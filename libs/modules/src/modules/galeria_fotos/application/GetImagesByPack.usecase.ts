import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ImagemPack } from '../@core/entities/ImagemPack.entity';

export class GetImagesByPackUseCase {
  @InjectRepository(ImagemPack, 'mongo')
  private imagePack: Repository<ImagemPack>;

  async get(packId: string): Promise<string[]> {
    const pack = await this.imagePack.findOne({
      where: {
        _id: packId,
      },
    });
    console.log(pack, packId);
    if (!pack) throw new NotFoundException('Não foi achado o pack');
    return pack.images.map((i) => i.path);
  }
}
