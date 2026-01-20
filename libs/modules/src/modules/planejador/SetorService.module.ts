import { Module } from '@nestjs/common';
import { SetorService } from './infra/service/Setor.service';
import { SetorRepository } from './infra/repository/Setor.repository';

@Module({
  imports: [],
  providers: [SetorRepository, SetorService],
  exports: [SetorRepository, SetorService],
})
export class SetorServiceModule {}
