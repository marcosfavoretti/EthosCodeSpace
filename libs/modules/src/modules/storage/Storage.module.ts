import { Global, Module } from '@nestjs/common';
import { StorageService } from './application/Storage.service';
import { LocalStorageStrategy } from './infra/strategies/LocalStorage.strategy';
import { LocalStorageConfigModule } from './LocalStorageConfig.module';
import { IStorageStrategy } from './@core/interfaces/IStorage.strategy';
import { IStorageService } from './@core/interfaces/IStorage.service';

@Global()
@Module({
  imports: [LocalStorageConfigModule],
  providers: [
    {
      provide: IStorageStrategy,
      useClass: LocalStorageStrategy,
    },
    {
      provide: IStorageService,
      useClass: StorageService,
    },
  ],
  exports: [IStorageService],
})
export class StorageModule {}
