import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as axios from 'axios';

@Injectable()
export class UbiquitiHttpClient {
    private ubiquitiClient: Axios.AxiosInstance;

    constructor(private configService: ConfigService) {
        this.ubiquitiClient = axios.create({
            baseURL: this.configService.getOrThrow<string>('UBIQUITI_SERVICE_URL'),
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 5000,
        });
    }

    get client() {
        return this.ubiquitiClient;
    }
}
