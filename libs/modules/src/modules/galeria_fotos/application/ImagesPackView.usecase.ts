import * as path from 'path';
import * as fs from 'node:fs';
import Handlebars from 'handlebars';
import { format } from 'date-fns';
import { ImagemPack } from '../@core/entities/ImagemPack.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetImagesPackUseCase {
  private readonly templatePath = path.resolve(
    __dirname,
    '../../../view/ImagesTemplate.html',
  );

  constructor() {
    Handlebars.registerHelper('formatDate', function (date: string | Date) {
      try {
        const parsed = new Date(date);
        return format(parsed, 'dd/MM/yyyy');
      } catch (e) {
        return 'Data inválida';
      }
    });
  }

  @InjectRepository(ImagemPack, 'mongo')
  private imagePack: Repository<ImagemPack>;

  async buildRender(packetId: string): Promise<string> {
    const [packet, templateBuffer] = await Promise.all([
      this.findImagePack(packetId),
      fs.readFileSync(this.templatePath),
    ]);
    // await packet.loadAllImagesInX64();
    const templateHandleBars = Handlebars.compile(templateBuffer.toString());
    return templateHandleBars(packet);
  }

  private async findImagePack(packId: string): Promise<ImagemPack> {
    return await this.imagePack.findOneOrFail({
      where: {
        _id: packId,
      },
    });
  }
}
