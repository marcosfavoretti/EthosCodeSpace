import { Module } from '@nestjs/common';
import { NotificaPorEmailUseCase } from './application/NotificaPorEmail.service';
import { NotificaServiceModule } from './NotificaService.module';

@Module({
    imports: [ NotificaServiceModule],
    providers: [NotificaPorEmailUseCase],
    exports: [NotificaPorEmailUseCase]
})
export class NotificacaoModule { }
