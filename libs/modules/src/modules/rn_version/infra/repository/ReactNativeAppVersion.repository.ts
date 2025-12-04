import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ReactNativeAppVersion } from '../../@core/entities/ReactNativeAppVersion.entity';

export class ReactNativeAppVersionRepository extends Repository<ReactNativeAppVersion> {
  constructor(@InjectDataSource('mysql') dt: DataSource) {
    super(ReactNativeAppVersion, dt.createEntityManager());
  }
}
