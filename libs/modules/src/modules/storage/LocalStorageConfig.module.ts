import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageConfigDto } from './@core/domain/LocalStorageConfig.dto';

@Module({
  imports: [],
  providers: [
    {
      provide: LocalStorageConfigDto,
      useFactory: (config: ConfigService) => {
        const path = config.get<string>('LOCAL_STORAGE_PATH');
        Logger.debug(`Storage local configurado em : ${path}`, 'LOCAL STORAGE');
        return {
          path: path,
        };
      },
      inject: [ConfigService],
    },
  ],
  exports: [LocalStorageConfigDto],
})
export class LocalStorageConfigModule {}
