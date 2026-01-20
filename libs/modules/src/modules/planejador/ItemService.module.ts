import { Module } from '@nestjs/common';
import { ItemService } from './infra/service/Item.service';
import { ItemRepository } from './infra/repository/Item.repository';
import { AtualizaCapabilidade } from './infra/service/AtualizaCapabilidade.service';
import { IMontaEstrutura } from './@core/interfaces/IMontaEstrutura.ts';
import { EstruturaNeo4jApiService } from './infra/service/EstruturaNeo4jApi.service';
import { IConsultaRoteiro } from './@core/interfaces/IConsultaRoteiro';
import { IBuscarItemDependecias } from './@core/interfaces/IBuscarItemDependecias';
import { IConsultarRoteiroPrincipal } from './@core/interfaces/IConsultarRoteiroPrincipal';
import { RoteiroPrincipal } from './infra/service/RoteiroPrinciapal.service';
import { IConverteItem } from './@core/interfaces/IConverteItem';
import { SetorServiceModule } from './SetorService.module';
import { SharedContractsModule } from '@app/modules/shared/modules/SharedContracts.module';

@Module({
  imports: [
    SharedContractsModule.forRoot(),
    SetorServiceModule,
    SharedContractsModule,
  ],
  providers: [
    ItemRepository,
    ItemService,
    AtualizaCapabilidade,
    {
      provide: IMontaEstrutura,
      useClass: EstruturaNeo4jApiService,
    },
    {
      provide: IConsultaRoteiro,
      useClass: EstruturaNeo4jApiService,
    },
    {
      provide: IBuscarItemDependecias,
      useClass: EstruturaNeo4jApiService,
    },
    {
      provide: IConsultarRoteiroPrincipal,
      useClass: RoteiroPrincipal,
    },
    {
      provide: IConverteItem,
      useClass: EstruturaNeo4jApiService,
    },
  ],
  exports: [
    IMontaEstrutura,
    IConsultarRoteiroPrincipal,
    IConverteItem,
    IBuscarItemDependecias,
    IConsultaRoteiro,
    AtualizaCapabilidade,
    ItemService,
    ItemRepository,
  ],
})
export class ItemServiceModule {}
