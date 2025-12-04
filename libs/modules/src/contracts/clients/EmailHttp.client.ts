import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { SendEmailDTO } from "../dto/SendEmail.dto";

@Injectable()
export class EmailHttpClient {
    private emailClient: Axios.AxiosInstance;
    constructor(
        private configService: ConfigService
    ) {
        this.emailClient = axios.create({
            baseURL: this.configService.get<string>('EMAIL_SERVICE_URL'),
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 5000,
        });
    }

    async sendEmail(payload: SendEmailDTO): Promise<void> {
        try {
            await this.emailClient.post('/email', payload);
        } catch (error) {
            Logger.error(error);
            throw Error('Falha ao enviar email via serviço externo')
        }
    }
}
