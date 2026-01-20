import { CriaAppRouteReqDto } from '@app/modules/contracts/dto/CriaAppRouteReq.dto';
import { ResAppRouteAppDTO } from '@app/modules/contracts/dto/ResAppRoute.dto';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AppRouteRepository } from '../infra/repository/AppRoute.repository';

@Injectable()
export class CriaRotaUseCase {
  constructor(private readonly appRouteRepository: AppRouteRepository) {}

  async execute(input: CriaAppRouteReqDto): Promise<ResAppRouteAppDTO> {
    try {
      const newRoute = this.appRouteRepository.create(input);
      Logger.log(input);
      Logger.log(newRoute);
      const saveRoute = await this.appRouteRepository.save(newRoute);
      return ResAppRouteAppDTO.fromEntity(saveRoute);
    } catch (error) {
      Logger.error('Erro ao criar nova rota', error);
      throw new InternalServerErrorException('Erro ao criar nova rota');
    }
  }
}
