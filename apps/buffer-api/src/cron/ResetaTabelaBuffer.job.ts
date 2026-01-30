import { JobCriacaoTabelaUseCase } from '@app/modules/modules/buffer/application/JobCriacaoTabela.usecase';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ResetaTabelaBufferJob implements OnModuleInit {
  constructor(private jobCriacaoTabelaUseCase: JobCriacaoTabelaUseCase) {}

  onModuleInit() {
    Logger.debug(`Cron job ${ResetaTabelaBufferJob.name} up`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: ResetaTabelaBufferJob.name,
  })
  async execute(): Promise<void> {
    Logger.debug(`Jog is running ${new Date().toISOString()}. Good morning`);
    await this.jobCriacaoTabelaUseCase.job();
  }
}
