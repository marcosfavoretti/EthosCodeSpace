import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssingPowerbiDatasetDTO } from '@app/modules/contracts/dto/AssignPowerbiDataset.dto';
import { ConsultaDatasetsDto } from '@app/modules/contracts/dto/ConsultaDatasets.dto';
import { RefreshPowerbiDatasetDto } from '@app/modules/contracts/dto/RefreshPowerbiDataset.dto';
import { ResPowerbiDataset } from '@app/modules/contracts/dto/ResPowerbiDataset.dto';
import { ResPowerbiRefreshDate } from '@app/modules/contracts/dto/ResPowerbiRefreshDate.dto';
import { ResRefreshPowerbi } from '@app/modules/contracts/dto/ResRefreshPowerbi.dto';
import { AssignDatasetUsecase } from '@app/modules/modules/powerbi/application/AssignDataset.usecase';
import { GetDatasetsUseCase } from '@app/modules/modules/powerbi/application/GetDataset.usecase';
import { PowerbiDatasetRefreshUseCase } from '@app/modules/modules/powerbi/application/powerbi-dataset-refresh.usecase';
import { GetRefreshDatesUseCase } from '@app/modules/modules/powerbi/application/get-refresh-dates.usecase';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import type { CustomRequest } from '@app/modules/shared/types/AppRequest.type';
import { WsUserStoreService } from '../@core/service/WsUserStore.service';


@UseGuards(JwtGuard)
@ApiTags('powerbi')
@Controller('powerbi')
export class PbindexController {
  @Inject(GetDatasetsUseCase)
  private getDatasetsUseCase: GetDatasetsUseCase;

  @Inject(AssignDatasetUsecase)
  private assignDatasetUsecase: AssignDatasetUsecase;

  @Inject(PowerbiDatasetRefreshUseCase)
  private powerbiDatasetRefreshUseCase: PowerbiDatasetRefreshUseCase;

  @Inject(GetRefreshDatesUseCase)
  private getRefreshDatesUseCase: GetRefreshDatesUseCase;

  @Inject(WsUserStoreService)
  private wsUserStoreUseCase: WsUserStoreService

  @Get('datasets')
  @ApiOperation({ summary: 'Lista todos os datasets do PowerBI' })
  @ApiResponse({
    status: 200,
    description: 'Lista de datasets retornada com sucesso',
    type: () => ResPowerbiDataset,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async getDatasets(
    @Req() dto: CustomRequest
  ): Promise<ResPowerbiDataset[]> {
    return await this.getDatasetsUseCase.get(dto.user);
  }

  @Post('datasets')
  @ApiOperation({ summary: 'Cria um novo dataset/link do PowerBI' })
  @ApiResponse({
    status: 201,
    description: 'Dataset criado com sucesso',
    type: () => ResPowerbiDataset,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao criar o link do PowerBI',
  })
  async assignDataset(
    @Body() dto: AssingPowerbiDatasetDTO,
    @Req() req: CustomRequest
  ): Promise<ResPowerbiDataset> {
    return await this.assignDatasetUsecase.assing(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Solicita atualização de um dataset do PowerBI' })
  @ApiResponse({
    status: 200,
    description: 'Atualização iniciada com sucesso',
    type: () => ResRefreshPowerbi,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao atualizar o dataset',
  })
  @ApiResponse({
    status: 404,
    description: 'Dataset não encontrado',
  })
  async refreshDataset(
    @Body() dto: RefreshPowerbiDatasetDto,
    @Req() req: CustomRequest,
  ): Promise<ResRefreshPowerbi> {
    return await this.powerbiDatasetRefreshUseCase.execute({
      admin: false,
      authorName: req.user.name,
      ...dto,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(CargoEnum.ADMIN, CargoEnum.ADMIN_POWERBI, CargoEnum.ADMIN_POWERBI_VIEW)
  @Post('refresh/admin')
  @ApiOperation({ summary: 'Solicita atualização de um dataset do PowerBI como admin' })
  @ApiResponse({
    status: 200,
    description: 'Atualização iniciada com sucesso',
    type: () => ResRefreshPowerbi,
  })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Erro ao atualizar o dataset',
  // })
  @ApiResponse({
    status: 404,
    description: 'Dataset não encontrado',
  })
  async refreshDatasetAsAdmin(
    @Body() dto: RefreshPowerbiDatasetDto,
    @Req() req: CustomRequest,
  ): Promise<ResRefreshPowerbi> {
    return await this.powerbiDatasetRefreshUseCase.execute({
      admin: true,
      authorName: req.user.name,
      ...dto,
    });
  }

  @Get('refresh/:datasetId')
  @ApiOperation({ summary: 'Obtém a data da última atualização de um dataset' })
  @ApiResponse({
    status: 200,
    description: 'Data da última atualização retornada com sucesso',
    type: () => ResPowerbiRefreshDate,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao obter data de atualização',
  })
  async getRefreshDate(
    @Query('datasetId') datasetId: string,
  ): Promise<ResPowerbiRefreshDate> {
    const severTime = await this.getRefreshDatesUseCase.getdate(Number(datasetId));
    return { severTime };
  }



  @Get('/online-users')
  @ApiOperation({ summary: 'Obtém a lista de usuários conectados ao WebSocket' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: String,
    isArray: true,
  })
  async getOnlineUsers(
  ): Promise<string[]> {
    return await this.wsUserStoreUseCase.getUsers().map(user => user.handshake.query.name as string);
  }

}