import { CODIGOSETOR } from '@app/modules/modules/planejador/@core/enum/CodigoSetor.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SetorResDTO {
  @ApiProperty()
  codigo: CODIGOSETOR;

  @ApiProperty()
  nome: string;
}
