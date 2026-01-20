import { SendEmailDTO } from '@app/modules/contracts/dto/SendEmail.dto';
import { NotificaPorEmailUseCase } from '@app/modules/modules/notificacao/application/NotificaPorEmail.service';
import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';

@Controller('/email')
export class NotificacaoApiEmailController {
  @Inject(NotificaPorEmailUseCase)
  private notificaPorEmailUseCase: NotificaPorEmailUseCase;
  @Post()
  @HttpCode(200)
  async sendEmail(@Body() sendEmailDto: SendEmailDTO) {
    await this.notificaPorEmailUseCase.send(sendEmailDto);
  }
}
