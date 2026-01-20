import { IsDate, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResDto } from './UserRes.dto';
import { MergeRequest } from '@app/modules/modules/planejador/@core/entities/MergeRequest.entity';

export class MergeRequestPendingDto {
  @ApiProperty()
  @IsString()
  fabricaId: string;

  @ApiProperty()
  @IsNumber()
  mergeRequestId: number;

  @ApiProperty({
    type: () => UserResDto,
  })
  @Type(() => UserResDto)
  user: UserResDto;

  @ApiProperty()
  @IsDate()
  criadaEm: Date;

  static createByEntity(merge: MergeRequest): MergeRequestPendingDto {
    return {
      fabricaId: merge.fabrica.fabricaId,
      criadaEm: merge.criadaEm,
      mergeRequestId: merge.mergeRequestId,
      user: {
        email: merge.feitoPor.email,
        name: merge.feitoPor.name,
        id: merge.feitoPor.id,
      },
    };
  }
}
