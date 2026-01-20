import { RegistroPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/RegistroPonto.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResTipoMarcacaoDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  marcacao: string;

  @ApiProperty()
  dataStr: string;

  @ApiProperty()
  data: Date;
}
