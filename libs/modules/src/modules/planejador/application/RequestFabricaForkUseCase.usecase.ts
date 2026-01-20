import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { Fabrica } from '../@core/entities/Fabrica.entity';
import { FabricaService } from '../infra/service/Fabrica.service';
import { ForkFabricaService } from '../infra/service/ForkFabrica.service';
import { IUserService } from '../../user/@core/interfaces/IUserService';
import { FabricaForkDTO } from '@app/modules/contracts/dto/FabricaFork.dto';

export class RequestFabricaForkUseCase {
  constructor(
    @Inject(FabricaService) private fabricaService: FabricaService,
    @Inject(ForkFabricaService) private forkFabricaService: ForkFabricaService,
    @Inject(IUserService) private userService: IUserService,
  ) {}

  //pode escutar alguns eventos ex: importacao de pedidos, mudanca de dateVirtual
  async fork(
    dto: FabricaForkDTO,
    novaPrincipal: boolean = false,
  ): Promise<Fabrica> {
    try {
      const user = await this.userService.getUser(dto.userId);
      console.log(user);
      const fabricaAlvo = await this.fabricaService.consultaFabricaPrincipal();
      if (!fabricaAlvo)
        throw new Error('nao foi possivel encontrar nenhuma fabrica principal');
      const fabricafork = await this.forkFabricaService.fork({
        fabrica: fabricaAlvo,
        isPrincipal: novaPrincipal,
        user: user,
      });
      return await this.fabricaService.saveFabrica(fabricafork);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'falha ao requerir fork da fabrica',
      );
    }
  }
}
