import { Module } from '@nestjs/common';
import { AppRouteRepository } from './infra/repository/AppRoute.repository';

@Module({
  imports: [],
  providers: [AppRouteRepository],
  exports: [AppRouteRepository],
})
export class AppEthosServiceModule {}
