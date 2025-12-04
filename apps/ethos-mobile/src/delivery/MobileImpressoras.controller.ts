import { CreateImpressoraBluetoothDto } from '@app/modules/contracts/dto/CreateImpressoraBluetooth.dto';
import { ImpressoraBluetoothResponseDto } from '@app/modules/contracts/dto/ImpressoraBluetoothResponse.dto';
import { CreateImpressoraBluetoothUseCase } from '@app/modules/modules/impressora-bluetooth/application/CreateImpressoraBluetooth.usecase';
import { DeleteImpressoraBluetoothUseCase } from '@app/modules/modules/impressora-bluetooth/application/DeleteImpressoraBluetooth.usecase';
import { GetImpressoraBluetoothUseCase } from '@app/modules/modules/impressora-bluetooth/application/GetImpressoraBluetooth.usecase';
import { ListImpressoraBluetoothUseCase } from '@app/modules/modules/impressora-bluetooth/application/ListImpressoraBluetooth.usecase';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Impressora Bluetooth')
@Controller('impressora-bluetooth')
export class MobileImpressoraController {
  constructor(
    private readonly createUseCase: CreateImpressoraBluetoothUseCase,
    private readonly deleteUseCase: DeleteImpressoraBluetoothUseCase,
    private readonly getUseCase: GetImpressoraBluetoothUseCase,
    private readonly listUseCase: ListImpressoraBluetoothUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova impressora Bluetooth' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Impressora criada com sucesso',
    type: ImpressoraBluetoothResponseDto,
  })
  async create(
    @Body() createDto: CreateImpressoraBluetoothDto,
  ): Promise<ImpressoraBluetoothResponseDto> {
    return this.createUseCase.execute(createDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Busca uma impressora Bluetooth pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Impressora encontrada',
    type: ImpressoraBluetoothResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Impressora não encontrada',
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<ImpressoraBluetoothResponseDto> {
    return this.getUseCase.execute(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista todas as impressoras Bluetooth' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de impressoras',
    type: [ImpressoraBluetoothResponseDto],
  })
  async findAll(): Promise<ImpressoraBluetoothResponseDto[]> {
    return this.listUseCase.execute();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta uma impressora Bluetooth' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Impressora deletada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Impressora não encontrada',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUseCase.execute(id);
  }
}
