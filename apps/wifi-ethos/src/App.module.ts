import { typeormMongoConfig } from "@app/modules/config/TypeormMongoConfig.module";
import { WifiCodeMagicLink } from "@app/modules/modules/wifiEthos/@core/entities/WifiCodeMagicLink.entity";
import { WifiCodeManager } from "@app/modules/modules/wifiEthos/@core/entities/WifiCodeManager.entity";
import { WifiEthosModule } from "@app/modules/modules/wifiEthos/WifiEthos.module";
import { SharedAuthModule } from "@app/modules/shared/modules/SharedAuth.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WifiEthosController } from "./delivery/WifiEthos.controller";
import { validate } from "./config/env.validation";

const entities = [
    WifiCodeManager,
    WifiCodeMagicLink
]
@Module({
    imports: [
        WifiEthosModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/wifi-ethos/.env',
            validate,
        }),
        TypeOrmModule.forRootAsync({
            name: 'mongo',
            imports: [ConfigModule],
            useFactory: (c: ConfigService) => typeormMongoConfig([...entities], c),
            inject: [ConfigService],
        }),
        SharedAuthModule.forRoot(),
    ],
    controllers: [WifiEthosController],
    providers: [],
    exports: [],
})
export class AppModule {}