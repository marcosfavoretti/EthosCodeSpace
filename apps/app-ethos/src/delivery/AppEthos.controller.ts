import { AtualizaAppRouteReqDTO } from "@app/modules/contracts/dto/AtualizaAppRouteReq.dto";
import { ConsultaPorIdDto } from "@app/modules/contracts/dto/ConsultaPorId.dto";
import { CriaAppRouteReqDto } from "@app/modules/contracts/dto/CriaAppRouteReq.dto";
import { ResAppRouteAppDTO } from "@app/modules/contracts/dto/ResAppRoute.dto";
import { AtualizaRotaUseCase } from "@app/modules/modules/app-ethos/application/AtualizaRota.usecase";
import { ConsultaRotasDoUsuarioUsecase } from "@app/modules/modules/app-ethos/application/ConsultaRotasDoUsuario.usecase";
import { CriaRotaUseCase } from "@app/modules/modules/app-ethos/application/CriaRota.usecase";
import { DeletaRotaUseCase } from "@app/modules/modules/app-ethos/application/DeletaRota.usecase";
import { CargoEnum } from "@app/modules/modules/user/@core/enum/CARGOS.enum";
import { Roles } from "@app/modules/shared/decorators/Cargo.decorator";
import { JwtGuard } from "@app/modules/shared/guards/jwt.guard";
import { RolesGuard } from "@app/modules/shared/guards/VerificaCargo.guard";
import type { CustomRequest } from "@app/modules/shared/types/AppRequest.type";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@Controller('/app')
export class AppEthosController {

    @Inject(ConsultaRotasDoUsuarioUsecase) private consultaRotasDoUsuarioUsecase: ConsultaRotasDoUsuarioUsecase;
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiResponse({
        type: ResAppRouteAppDTO,
        isArray: true,
        status: 200,
        description: 'Lista as rotas disponíveis para o usuário autenticado.'
    })
    @Get('/routes')
    public async getRoutesForUser(
        @Req() req: CustomRequest
    ): Promise<ResAppRouteAppDTO[]> {
        const routes = await this.consultaRotasDoUsuarioUsecase.execute(req.user);
        return routes;
    }

    /**CRUD DE ROTAS */
    //atualiza rota
    @Inject(AtualizaRotaUseCase) private atualizaRotaUseCase: AtualizaRotaUseCase;
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(CargoEnum.ADMIN)
    @Put('/routes/:id')
    public async atualizaRoutes(
        @Param() dtoId: ConsultaPorIdDto,
        @Body() dtoUpdate: AtualizaAppRouteReqDTO
    ): Promise<any> {
        const routes = await this.atualizaRotaUseCase.execute({
            id: dtoId,
            data: dtoUpdate
        });
        return routes;
    }

    //cria rota
    @Inject(CriaRotaUseCase) private criaRotaUseCase: CriaRotaUseCase;
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(CargoEnum.ADMIN)
    @Post('/routes')
    public async criaRoutes(@Body() req: CriaAppRouteReqDto): Promise<any> {
        const routes = await this.criaRotaUseCase.execute(req);
        return routes;
    }

    //deleta rota
    @Inject(DeletaRotaUseCase) private deletaRotaUseCase: DeletaRotaUseCase;
    @Roles(CargoEnum.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Delete('/routes/:id')
    public async deletaRoutes(@Param() param: ConsultaPorIdDto): Promise<void> {
        return await this.deletaRotaUseCase.execute(param);
    }

}