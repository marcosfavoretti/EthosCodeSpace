import { ProcessaCertificadoUseCase } from "@app/modules/modules/certificadosCat/application/ProcessaCertificado.usecase";
import { ReprocessaCertificadoUseCase } from "@app/modules/modules/certificadosCat/application/ReprocessaCertificado.usecase"; // Importar o novo UseCase
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as chokidar from 'chokidar';
import * as path from 'path';

@Injectable()
export class DirWatcherService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DirWatcherService.name);
    private watcher: chokidar.FSWatcher;

    constructor(
        private configService: ConfigService,
        private processaCertificadoUseCase: ProcessaCertificadoUseCase,
        private reprocessaCertificadoUseCase: ReprocessaCertificadoUseCase // Injetar o novo UseCase
    ) { }

    onModuleInit() {
        this.setupTriggers();
    }

    async onModuleDestroy() {
        if (this.watcher) {
            await this.watcher.close();
        }
    }

    setupTriggers(): void {
        const dirPath = this.configService.get<string>('CERTIFICADOS_CAT_WATCHER_DIR_PATH');

        if (!dirPath) {
            this.logger.error('VARIAVEL CERTIFICADOS_CAT_WATCHER_DIR_PATH NÃO DEFINIDA.');
            return;
        }

        this.logger.log(`Iniciando monitoramento na pasta: ${dirPath}`);

        this.watcher = chokidar.watch(dirPath, {
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100
            },
        });

        // Refatora a lógica de manipulação de arquivo em uma única função
        const handleFileEvent = async (filePath: string, eventType: 'adicionado' | 'modificado') => {
            const fileName = path.parse(filePath).name;
            const fullFileName = path.basename(filePath);
            const pattern = /^ETH\d+$/;

            if (!pattern.test(fileName)) {
                this.logger.warn(`Arquivo ignorado (Padrão inválido): ${fullFileName}. Esperado: ETH + Números.`);
                return;
            }

            this.logger.log(`Arquivo válido ${eventType}: ${fullFileName}`);

            try {
                if (eventType === 'adicionado') {
                    await this.processaCertificadoUseCase.execute({ filepath: filePath });
                } else if (eventType === 'modificado') {
                    await this.reprocessaCertificadoUseCase.execute({ filepath: filePath });
                }
                this.logger.log(`Arquivo ${fullFileName} processado com sucesso.`);
            } catch (error) {
                this.logger.error(`Erro ao processar arquivo ${fullFileName}`, (error as Error).stack);
            }
        };

        this.watcher.on('add', (filePath) => handleFileEvent(filePath, 'adicionado'));
        this.watcher.on('change', (filePath) => handleFileEvent(filePath, 'modificado')); // Lidar com o evento 'change'
        this.watcher.on('error', (error) => {
            this.logger.error(`Erro no Watcher: ${(error as Error).message}`);
        });
    }
}