import { GaleriaCreateImagePackDto } from '@app/modules/contracts/dto/CreateImagePack.dto';
import { GaleriaReportQualidadeDTO } from '@app/modules/contracts/dto/GaleriaReportQualidade.dto';
import { GetImagesByPackUseCase } from '@app/modules/modules/galeria_fotos/application/GetImagesByPack.usecase';
import { RegisterImagePackUseCase } from '@app/modules/modules/galeria_fotos/application/RegisterImagePack.usecase';
import { SubmitPhotoToQualityUsecase } from '@app/modules/modules/galeria_fotos/application/SubmitPhotoToQuality.usecase';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader } from '@nestjs/swagger';
import { memoryStorage } from 'multer';

@Controller('/galeria')
export class MobileGaleriaController {
  //-------------------------Consultar pack de fotos route-------------------------//
  @Inject(GetImagesByPackUseCase)
  private getImagesByPackUseCase: GetImagesByPackUseCase;
  @Get('/pack/:id')
  async getImagePackMethod(@Param('id') id: string): Promise<string[]> {
    return await this.getImagesByPackUseCase.get(id);
  }
  //-------------------------ReportQualidade pack route--------------------------------//
  @Inject(SubmitPhotoToQualityUsecase)
  private reportQualidadeUseCase: SubmitPhotoToQualityUsecase;
  @Post('/report-qualidade')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        nSerie: {
          type: 'string',
        },
        gate: {
          type: 'string',
        },
        codItem: {
          type: 'string',
        },
      },
    },
  })
  @ApiHeader({
    name: 'version',
    description: 'react native version',
    required: true,
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  async uploadProject(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|mp4)$/,
          skipMagicNumbersValidation: true,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
    @Body() body: GaleriaReportQualidadeDTO,
  ) {
    return await this.reportQualidadeUseCase.create(body, files);
  }

  //-------------------------Imagem pack route-------------------------------- //
  @Inject(RegisterImagePackUseCase)
  private registerGateImageUseCase: RegisterImagePackUseCase;
  @Post('/pack')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        author: {
          type: 'string',
        },
      },
    },
  })
  @ApiHeader({
    name: 'version',
    description: 'react native version',
    required: true,
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  async registerImagePackMethod(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|mp4)$/,
          skipMagicNumbersValidation: true,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
    @Body() createImagePackDto: GaleriaCreateImagePackDto,
  ) {
    return await this.registerGateImageUseCase.register(
      createImagePackDto,
      files,
    );
  }
}
