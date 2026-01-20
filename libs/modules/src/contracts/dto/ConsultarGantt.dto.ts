import { OqColorirGantt } from '@app/modules/modules/planejador/@core/enum/OqueColorirGantt.enum';
import {  ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class ConsultarGanttDTO {
  @ApiProperty()
  @IsString()
  fabricaId: string;

  @ApiProperty({
    enum: OqColorirGantt,
  })
  @IsEnum(OqColorirGantt)
  colorir: OqColorirGantt;
}
