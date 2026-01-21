import { Injectable, Logger } from '@nestjs/common';
import { IOnUserCreated } from '../../@core/interfaces/IOnUserCreated';
import { User } from '../../@core/entities/User.entity';
import { EmailHttpClient } from '@app/modules/contracts/clients/EmailHttp.client';
import { ConfigService } from '@nestjs/config';
import { ethos_logox64 } from '@app/modules/utils/ethos_logox64';

@Injectable()
export class EmailDeValidacaoService implements IOnUserCreated {
  constructor(
    private emailHttpClient: EmailHttpClient,
    private configService: ConfigService,
  ) {}
  async oncreate(props: { user: User; code: string }): Promise<void> {
    try {
      await this.emailHttpClient.sendEmail({
        to: [props.user.email],
        subject: 'Valide suas credenciais',
        attachments: [],
        html: `
                <!-- Email bonito de valicao de credenciais com botao com hook para o webhook de valicao de usuario -->
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Validação de Credenciais</h2>
                        <p>Olá <strong>${props.user.name}</strong>,</p>
                        <p>Obrigado por se registrar em nossa plataforma. Para ativar sua conta, por favor, clique no botão abaixo para validar suas credenciais:</p>
                        <p style="text-align: center;">
                            <a href="${this.configService.get<string>('USER_SERVICE_URL')}/validate-user/${props.code}" style="display: inline-block; padding: 10px 20px; background-color: #0a7f2fdf; color: #ffffff; text-decoration: none; border-radius: 5px;">Validar Credenciais</a>
                        </p>
                        <p>Se o botão acima não funcionar, você pode copiar e colar o seguinte link em seu navegador:</p>
                        <p><a href="${this.configService.get<string>('USER_SERVICE_URL')}/validate-user/${props.code}">${this.configService.get<string>('USER_SERVICE_URL')}/validate-user/${props.code}</a></p>
                        <p>Este link de validação expira em 24 horas.</p>
                        <p>Se você não solicitou este registro, por favor, ignore este e-mail.</p>
                        <p>Atenciosamente,</p>
                        <p>Equipe Ethos</p>
                        <img src='${ethos_logox64}'></img>
    
                    </div>
                    `,
      });
    } catch (error) {
      Logger.error(error, EmailDeValidacaoService.name);
    }
  }
}
