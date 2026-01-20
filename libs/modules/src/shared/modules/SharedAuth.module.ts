import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import * as dotenv from 'dotenv'; 
import { IJwtValidate } from "../interfaces/IJwtValidate";
import { JwtProduction } from "../services/JwtProduction";
import { JwtDev } from "../services/JwtDev";

@Module({})
export class SharedAuthModule {
    static forRoot(): DynamicModule { 
        
        dotenv.config({ path: 'apps/.env' });
        const mode = process.env.APP_MODE?.toUpperCase() || 'PROD';
        const isProd = mode === 'PROD';

        const imports: any[] = [
            ConfigModule.forRoot({
                envFilePath: 'apps/.env',
                isGlobal: true,
            }),
        ];

        if (isProd) {
            imports.push(
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    global: true,
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get<string>('SECRET'),
                        signOptions: {
                            expiresIn: parseInt(
                                configService.get<string>('EXPIREHOURS') || '3600',
                                10,
                            ),
                        },
                    }),
                    inject: [ConfigService],
                }),
            );
        }

        const providers: Provider[] = [
            isProd ? JwtProduction : JwtDev,
            {
                provide: IJwtValidate,
                useExisting: isProd ? JwtProduction : JwtDev,
            }
        ];
        return {
            module: SharedAuthModule,
            imports: imports,
            providers: providers,
            exports: [IJwtValidate],
        };
    }
}