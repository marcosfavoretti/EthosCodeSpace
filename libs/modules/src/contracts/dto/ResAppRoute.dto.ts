import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { AppRoute } from '@app/modules/modules/app-ethos/@core/entities/AppRoute.entity';

class AppSubRouteRes {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  route: string;

  @ApiProperty()
  desc: string;
}

export class ResAppRouteAppDTO {
  @ApiProperty()
  _id: string;

  @ApiProperty({
    type: AppSubRouteRes,
    isArray: true,
  })
  subRoutes: AppSubRouteRes[];

  @ApiProperty({
    enum: CargoEnum,
    isArray: true,
  })
  cargos: CargoEnum[];

  @ApiProperty()
  name: string;

  @ApiProperty()
  route: string;

  @ApiProperty()
  desc: string;

  static fromEntity(entity: AppRoute): ResAppRouteAppDTO {
    const dto = new ResAppRouteAppDTO();
    dto._id = entity._id.toString();
    dto.name = entity.name;
    dto.route = entity.route;
    dto.desc = entity.desc;
    dto.cargos = entity.cargos;
    dto.subRoutes =
      entity?.subRoutes &&
      entity?.subRoutes.map((subRoute) => {
        const subRouteDto = new AppSubRouteRes();
        subRouteDto.name = subRoute.name;
        subRouteDto.route = subRoute.route;
        subRouteDto.desc = subRoute.desc;
        return subRouteDto;
      });
    return dto;
  }
}
