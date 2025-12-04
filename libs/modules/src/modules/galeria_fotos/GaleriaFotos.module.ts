import { Module } from '@nestjs/common';
import { GetImagesByPackUseCase } from './application/GetImagesByPack.usecase';
import { RegisterImagePackUseCase } from './application/RegisterImagePack.usecase';
import { GaleriaFotosServiceModule } from './GaleriaFotosService.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagemPack } from './@core/entities/ImagemPack.entity';
import { StorageModule } from '../storage/Storage.module';
import { SubmitPhotoToQualityUsecase } from './application/SubmitPhotoToQuality.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImagemPack], 'mongo'),
    GaleriaFotosServiceModule,
    StorageModule,
  ],
  providers: [
    SubmitPhotoToQualityUsecase,
    GetImagesByPackUseCase,
    RegisterImagePackUseCase,
  ],
  exports: [
    SubmitPhotoToQualityUsecase,
    GetImagesByPackUseCase,
    RegisterImagePackUseCase,
  ],
})
export class GaleriaFotosModule {}
