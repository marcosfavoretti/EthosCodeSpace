import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { FabricaService } from '../infra/service/Fabrica.service';
import { MergeRequestService } from '../infra/service/MergeRequest.service';
import { IUserService } from '../../user/@core/interfaces/IUserService';
import { UserFabricaResponseDto } from '@app/modules/contracts/dto/UserFabricaResponse.dto';
import { ConsultaFabricaDoUsuarioDTO } from '@app/modules/contracts/dto/ConsultaFabricaDoUsuario.dto';

export class ConsutlarFabricasDoUsuarioUseCase {
  constructor(
    @Inject(IUserService) private userService: IUserService,
    @Inject(FabricaService) private fabrica: FabricaService,
    @Inject(FabricaService) private fabricaService: FabricaService,
    @Inject(MergeRequestService)
    private mergeRequestService: MergeRequestService,
  ) {}

  async consultar(
    dto: ConsultaFabricaDoUsuarioDTO,
  ): Promise<UserFabricaResponseDto[]> {
    try {
      const user = await this.userService.getUser(dto.userId);

      const fabricas = await this.fabrica.consultaFabricasDoUsuario(user);

      const fabricaPrincipal =
        await this.fabricaService.consultaFabricaPrincipal();

      const currentMerges = await this.mergeRequestService.findMergeByFather(
        fabricaPrincipal!,
      );

      const currentMergesFabricaIds = currentMerges.map(
        (c) => c.fabrica.fabricaId,
      );

      return fabricas
        .filter((f) => !f.principal)
        .map((f) =>
          UserFabricaResponseDto.fromEntity(
            f,
            currentMergesFabricaIds.includes(f.fabricaId),
          ),
        );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
