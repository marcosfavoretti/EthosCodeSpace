import { IJwtValidate } from "../interfaces/IJwtValidate";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import {  Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtGuard } from "../guards/jwt.guard";

@Injectable()
export class JwtProduction
    implements IJwtValidate {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    private readonly logger = new Logger(JwtGuard.name);

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.access_token;
    }

    async validate(req: Request): Promise<boolean> {
        const token = this.extractTokenFromCookie(req);

        if (!token) {
            throw new UnauthorizedException('Token não encontrado');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            req['user'] = {
                ...payload
            };
            return true;
        } catch (error) {
            this.logger.warn(`Token inválido: ${error.message}`);
            throw new UnauthorizedException('Sessão inválida ou expirada');
        }
    }
}   