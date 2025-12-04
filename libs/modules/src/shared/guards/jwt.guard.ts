import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException, // Use Unauthorized (401) para auth, Forbidden (403) é para permissão
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Use o padrão do Nest ou seu wrapper
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      // 1. Verifica se a assinatura é válida e se não expirou
      // Isso NÃO vai no banco de dados. É pura criptografia/matemática.
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Isso desacopla totalmente do banco de dados MySQL
      request['user'] = {
        ...payload // Lembra da conversa anterior? Isso ajuda aqui!
        // ...outros dados úteis do payload
      };

      return true;
    } catch (error) {
      this.logger.warn(`Token inválido: ${error.message}`);
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.access_token;
  }
}