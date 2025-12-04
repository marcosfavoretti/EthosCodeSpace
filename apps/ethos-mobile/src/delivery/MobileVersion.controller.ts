import { GetAppReactNativeVersionUseCase } from '@app/modules/modules/rn_version/application/get-appReactNativeVersion.usecase';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('version')
export class MobileVersionController {
  @Inject(GetAppReactNativeVersionUseCase)
  private appUseCase: GetAppReactNativeVersionUseCase;
  @Get('/')
  async getVersion(): Promise<string> {
    return await this.appUseCase.get();
  }
}
