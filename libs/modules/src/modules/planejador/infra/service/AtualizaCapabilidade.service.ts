import { ItemCapabilidade } from '../../@core/entities/ItemCapabilidade.entity';
import { Inject } from '@nestjs/common';
import { SetorService } from './Setor.service';
import { ItemComCapabilidade } from '../../@core/entities/Item.entity';
import { ConsultarTabelaCapabilidadeDTO } from '@app/modules/contracts/dto/ConsultarTabelaCapabilidade.dto';
import { CODIGOSETOR } from '../../@core/enum/CodigoSetor.enum';

export class AtualizaCapabilidade {
  constructor(
    @Inject(SetorService) private readonly setorService: SetorService,
  ) {}

  async atualizar(
    item: ItemComCapabilidade,
    dto: ConsultarTabelaCapabilidadeDTO,
  ): Promise<ItemComCapabilidade> {
    item.itemCapabilidade = [];
    for (const setorCodigo of Object.keys(dto.capabilidade) as CODIGOSETOR[]) {
      const setor = await this.setorService.consultarSetor(setorCodigo);
      if (!setor) continue;
      const cap = new ItemCapabilidade();
      cap.setor = setor;
      cap.capabilidade = dto.capabilidade[setorCodigo] ?? 0;
      cap.leadTime = dto.leadtime[setorCodigo] ?? 0;
      cap.item = item;
      item.itemCapabilidade.push(cap);
    }
    // Apenas retorna o item atualizado, sem salvar no banco
    return item;
  }
}
