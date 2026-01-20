import { EmailHttpClient } from '@app/modules/contracts/clients/EmailHttp.client';
import { EstruturaHttpClient } from '@app/modules/contracts/clients/EstruturaHttp.client';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

@Module({})
export class SharedContractsModule {
  static forRoot(): DynamicModule {
    dotenv.config({ path: 'apps/.env' });

    const imports: any[] = [
      ConfigModule.forRoot({
        envFilePath: 'apps/.env',
        isGlobal: true,
      }),
    ];

    const providers: Provider[] = [EmailHttpClient, EstruturaHttpClient];

    return {
      module: SharedContractsModule,
      imports: imports,
      providers: providers,
      exports: providers,
    };
  }
}
