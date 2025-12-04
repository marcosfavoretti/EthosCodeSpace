import { Inject } from '@nestjs/common';
import { ReactNativeAppVersionRepository } from '../infra/repository/ReactNativeAppVersion.repository';

export class GetAppReactNativeVersionUseCase {
  @Inject(ReactNativeAppVersionRepository)
  private reactRepo: ReactNativeAppVersionRepository;

  async get(): Promise<string> {
    const [target, ..._] = await this.reactRepo.find({
      order: {
        reactNativeAppVersionID: 'DESC',
      },
    });
    return target ? target.currentVersion : '0.0';
  }
}
