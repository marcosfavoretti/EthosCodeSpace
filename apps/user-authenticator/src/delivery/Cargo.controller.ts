import { SetUserCargoDTO } from '@app/modules/contracts/dto/SetUserCargo.dto';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { SetUseCargoUseCase } from '@app/modules/modules/user/application/SetUserCargo.usecase';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cargo')
@Controller('/cargo')
export class CargoController {
  @Inject(SetUseCargoUseCase) private setUseCargoUseCase: SetUseCargoUseCase;
  @HttpCode(HttpStatus.OK)
  @Roles(CargoEnum.ADMIN, CargoEnum.CATERPILLAR_USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/set')
  public async setUserCargoMethod(
    @Body() payload: SetUserCargoDTO,
  ): Promise<void> {
    return await this.setUseCargoUseCase.set(payload);
  }
}
