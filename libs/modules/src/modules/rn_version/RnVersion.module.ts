import { Module } from '@nestjs/common';
import { GetAppReactNativeVersionUseCase } from './application/get-appReactNativeVersion.usecase';
import { ReactNativeAppVersionRepository } from './infra/repository/ReactNativeAppVersion.repository';

@Module({
  imports: [],
  providers: [GetAppReactNativeVersionUseCase, ReactNativeAppVersionRepository],
  exports: [GetAppReactNativeVersionUseCase],
})
export class RnVersionModule {}
