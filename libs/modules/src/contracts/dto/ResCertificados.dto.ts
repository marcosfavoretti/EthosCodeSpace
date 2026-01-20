import { CertificadosCatEntity } from '@app/modules/modules/certificadosCat/@core/entities/CertificadoCat.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class ResCertificadosDto {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsString()
  produto: string;

  @ApiProperty()
  @IsString()
  serialNumber: string;

  @ApiProperty()
  @IsDate()
  serverTime: Date;

  @ApiProperty()
  @IsString()
  certificadoPath: string;

  static fromEntity(entity: CertificadosCatEntity): ResCertificadosDto {
    const dto = new ResCertificadosDto();
    dto._id = entity._id.toString();
    dto.produto = entity.produto;
    dto.serialNumber = entity.serialNumber;
    dto.serverTime = entity.serverTime;
    dto.certificadoPath = entity.certificadoPath;
    return dto;
  }
}
