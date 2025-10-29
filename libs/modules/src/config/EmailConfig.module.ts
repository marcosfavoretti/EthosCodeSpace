import { registerAs } from '@nestjs/config';
import {Module} from "@nestjs/common"
/**
 * Define um "namespace" de configuração para e-mail.
 * Isso nos permite aceder a estas variáveis de forma tipada e organizada
 * através do ConfigService, por exemplo: configService.get('email.host')
 */
export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT! , 10) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para outros
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  from: process.env.EMAIL_FROM || '"Não Responder" <no-reply@exemplo.com>',
}));


@Module({
    imports: [],
    providers: [],
    exports: []
})
export class EmailConfig{}