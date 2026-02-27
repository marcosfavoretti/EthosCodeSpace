import { Module } from "@nestjs/common";
import { PowerbiserviceModule } from "./PowerbiService.module";
import { AssignDatasetUsecase, GetRefreshDatesUseCase, GetDatasetsUseCase, PowerbiDatasetRefreshUseCase } from "./application";

@Module({
  imports: [PowerbiserviceModule],
  providers: [
    AssignDatasetUsecase,
    GetRefreshDatesUseCase,
    GetDatasetsUseCase,
    PowerbiDatasetRefreshUseCase,
  ],
  exports: [
    AssignDatasetUsecase,
    GetRefreshDatesUseCase,
    GetDatasetsUseCase,
    PowerbiDatasetRefreshUseCase,
  ],
})
export class PowerbiModule{}
