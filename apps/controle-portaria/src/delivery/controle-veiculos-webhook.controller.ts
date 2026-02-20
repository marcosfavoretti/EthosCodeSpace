import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterVehicleEntryUseCase } from '@app/modules/modules/controleVeiculos/application/register-vehicle-entry.use-case';
import { RegisterVehicleExitUseCase } from '@app/modules/modules/controleVeiculos/application/register-vehicle-exit.use-case';
import { IntelbrasEventDTO } from 'libs/modules/contracts/dto/intelbras-event.dto';
import { VehicleResponseDto } from '@app/modules/contracts/dto/vehicle-response.dto';

@ApiTags('Controle de Veículos')
@Controller('veiculos/webhook')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
export class ControleVeiculosWebHookController {
  constructor(
    private readonly registerVehicleEntryUseCase: RegisterVehicleEntryUseCase,
    private readonly registerVehicleExitUseCase: RegisterVehicleExitUseCase,
  ) { }

  @Post('entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registra a entrada de um veículo' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entrada de veículo registrada com sucesso', type: VehicleResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Veículo já registrado como dentro' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados de entrada inválidos' })
  @ApiBody({ type: IntelbrasEventDTO, description: 'Dados do evento da câmera Intelbras para registro de entrada' })
  async registerEntry(@Body() request: IntelbrasEventDTO): Promise<VehicleResponseDto> {
    return this.registerVehicleEntryUseCase.execute(request);
  }

  @Get('entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Heartbeat endpoint (GET)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service is alive (GET).' })
  getHeartbeatEntry(): string {
    Logger.log('heartbeat entry', ControleVeiculosWebHookController.name)
    return 'Service is alive (GET)';
  }

  @Post('exit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registra a saída de um veículo' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Saída de veículo registrada com sucesso', type: VehicleResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Veículo não encontrado ou nunca entrou' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Veículo já registrado como fora' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados de saída inválidos' })
  @ApiBody({ type: IntelbrasEventDTO, description: 'Dados do evento da câmera Intelbras para registro de saída' })
  async registerExit(@Body() request: IntelbrasEventDTO): Promise<VehicleResponseDto> {
    return this.registerVehicleExitUseCase.execute(request);
  }

  @Get('exit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Heartbeat endpoint (GET)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service is alive (GET).' })
  getHeartbeatExit(): string {
    Logger.log('heartbeat exit', ControleVeiculosWebHookController.name)
    return 'Service is alive (GET)';
  }
}