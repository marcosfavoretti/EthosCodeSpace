import { UbiquitiHttpClient } from "@app/modules/contracts/clients/UbiquitiHttp.client";
import { cookiesExtractorByString } from "@app/modules/utils/cookiesExtractor";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// ubiquiti-auth.service.ts
@Injectable()
export class UbiquitiAuthService {
  constructor(
    private readonly http: UbiquitiHttpClient,
    private readonly config: ConfigService
  ) {}

  async getAuthHeaders(): Promise<{ headers: Record<string, string> }> {
    const { username, password } = this.getCredentials();
    
    const response = await this.http.client.post('/api/login', { 
        username, password, strict: true 
    });

    const cookies = response.headers['set-cookie'] as string[] || [];
    const parsed = cookiesExtractorByString(cookies); // Utilitário isolado

    if (!parsed?.csrf_token) throw new Error('Falha na autenticação Ubiquiti');

    return {
      headers: {
        'X-Csrf-Token': parsed.csrf_token,
        'Cookie': `unifises=${parsed.unifises}; csrf_token=${parsed.csrf_token}`
      }
    };
  }

  private getCredentials() {
      // logica simples de config
      return { 
          username: this.config.getOrThrow('UBIQUITI_USERNAME'),
          password: this.config.getOrThrow('UBIQUITI_PASSWORD')
      }
  }
}