import { Mudancas, TipoMudancas } from '@app/modules/modules/planejador/@core/classes/Mudancas';
import { ApiProperty } from '@nestjs/swagger';

export class MudancasResDto {
  @ApiProperty({
    enum: TipoMudancas,
  })
  mudanca: TipoMudancas;

  @ApiProperty()
  entidade: string;

  @ApiProperty()
  valorAntigo: string;

  @ApiProperty()
  valorNovo: string;

  static fromClass(mudanca: Mudancas): MudancasResDto {
    const dto = new MudancasResDto();
    dto.entidade = mudanca.getEntidade();
    dto.mudanca = mudanca.getMudanca();
    dto.valorAntigo = mudanca.getValorAntigo();
    dto.valorNovo = mudanca.getValorNovo();
    return dto;
  }
}
