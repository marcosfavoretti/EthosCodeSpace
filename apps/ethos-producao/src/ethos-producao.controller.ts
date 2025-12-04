import { Controller, Get } from '@nestjs/common';
import { EthosProducaoService } from './ethos-producao.service';

@Controller()
export class EthosProducaoController {
  constructor(private readonly ethosProducaoService: EthosProducaoService) {}

  @Get()
  getHello(): string {
    return this.ethosProducaoService.getHello();
  }

  //--------------------------------------------------------------------------------------------------------------------------
  // @Inject(ImagesPackViewUseCase) private view: ImagesPackViewUseCase;
  // @Get('/gate/:_id')
  // async getHtml(@Param('_id') id: string): Promise<string> {
  //     return await this.view.buildRender(id);
  // }
}
