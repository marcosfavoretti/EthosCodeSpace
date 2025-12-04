import { Injectable } from '@nestjs/common';
import { ITemplateBuilder } from '../../@core/interface/ITemplateBuilder';
import { Html2Image } from './Html2Image.service';

@Injectable()
export class ImageTemplateBuildService implements ITemplateBuilder {
  constructor(private html2image: Html2Image) {}
  async builin(props: {
    template: string;
    data: unknown;
  }): Promise<string | Buffer> {
    const { template } = props;
    const { x64 } = await this.html2image.convert({
      template,
    });
    return x64;
  }
}
