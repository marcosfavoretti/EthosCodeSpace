import { ApiProperty } from '@nestjs/swagger';
import { ResTipoMarcacaoDTO } from './ResTipoMarcacao.dto';

export class ResRegistroPontoTurnoPontoDTO {
  @ApiProperty()
  matricula: string;

  @ApiProperty()
  setor: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  turnoDia: Date;

  @ApiProperty()
  turnoDiaStr: string;

  @ApiProperty({
    isArray: true,
    type: ResTipoMarcacaoDTO,
  })
  registros: ResTipoMarcacaoDTO[];

  @ApiProperty()
  qtdHoras: number;

  @ApiProperty()
  horasIrregulares: number;
}
