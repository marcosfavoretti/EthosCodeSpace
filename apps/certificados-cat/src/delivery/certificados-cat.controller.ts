import { ProcessaCertificadoDTO } from '@app/modules/contracts/dto/ProcessaCertificado.dto';
import { ProcessaCertificadoUseCase } from '@app/modules/modules/certificadosCat/application/ProcessaCertificado.usecase';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConsultaCertificadosUseCase } from '@app/modules/modules/certificadosCat/application/ConsultaCertificados.usecase';
import { ConsultaCertificadosDTO } from '@app/modules/contracts/dto/ConsultaCertificados.dto';
import { PaginatedResponseDto } from '@app/modules/contracts/dto/ResponsePaginator.dto';
import { ConsultaCertificadoTXTUsecase } from '@app/modules/modules/certificadosCat/application/ConsultaCertificadoTXT.usecase';
import { ConsultaPorIdDto } from '@app/modules/contracts/dto/ConsultaPorId.dto';
import type { Response } from 'express';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { ResCertificadosDto } from '@app/modules/contracts/dto/ResCertificados.dto';

@UseGuards(JwtGuard)
@ApiTags('Certificados CAT')
@Controller('certificados')
export class CertificadosCatController {
  @Inject(ProcessaCertificadoUseCase)
  private readonly processaCertificadoUseCase: ProcessaCertificadoUseCase;
  @Roles(CargoEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('')
  @ApiOperation({ summary: 'Processa um arquivo de certificado bruto.' })
  async processarCertificado(
    @Body() dto: ProcessaCertificadoDTO,
  ): Promise<any> {
    const resultado = await this.processaCertificadoUseCase.execute(dto);
    return resultado;
  }

  @Inject(ConsultaCertificadosUseCase)
  private readonly consultaCertificadosUseCase: ConsultaCertificadosUseCase;
  @Get()
  @ApiOperation({ summary: 'Consulta certificados com paginação e filtros.' })
  @ApiOkResponse({
    description: 'Lista de certificados paginada.',
    type: PaginatedResponseDto(ResCertificadosDto),
  })
  @Roles(CargoEnum.CATERPILLAR_USER, CargoEnum.ADMIN)
  @UseGuards(RolesGuard)
  async consultarCertificados(@Query() query: ConsultaCertificadosDTO) {
    return this.consultaCertificadosUseCase.execute(query);
  }

  @Inject(ConsultaCertificadoTXTUsecase)
  private readonly consultaCertificadoTXTUsecase: ConsultaCertificadoTXTUsecase;
  @Get('/file/:id')
  @ApiOperation({ summary: 'Stream do arquivo txt.' })
  @ApiOkResponse({
    description: 'volta o stream do arquivo txt.',
  })
  @Roles(CargoEnum.CATERPILLAR_USER, CargoEnum.ADMIN)
  @UseGuards(RolesGuard)
  async retornaArquivoCertificadoTxt(
    @Res({ passthrough: true }) res: Response,
    @Param() query: ConsultaPorIdDto,
  ): Promise<StreamableFile> {
    const fileStream = await this.consultaCertificadoTXTUsecase.consultaTXT(
      query.id,
    );
    res.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="certificado_${query.id}.txt"`,
    });
    // O StreamableFile conecta o tubo do disco direto no tubo da resposta HTTP
    return new StreamableFile(fileStream);
  }
}
