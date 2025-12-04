import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { SendEmailDTO } from "@app/modules/contracts/dto/SendEmail.dto";
import { EmailSenderService } from "../infra/email-sender.service";
import { EmailFactory } from "../@core/service/email.factory";
import { ISendMessagesGeneric } from "../@core/interfaces/ISendMessageGeneric.abstract";


@Injectable()
export class NotificaPorEmailUseCase {
    constructor(
        @Inject(ISendMessagesGeneric) private emailservice: EmailSenderService,
        private factoryservice: EmailFactory
    ) { }
    async send(emaildto: SendEmailDTO) {
        try {
            const email = this.factoryservice.build(emaildto);
            if (emaildto.attachments && !!emaildto.attachments.length) {
                email.attachFiles(emaildto.attachments);
            }
            await this.emailservice.send(email);
        } catch (error) {
            Logger.error(error)
            throw new InternalServerErrorException('problemas ao enviar o email');
        }
    }
}