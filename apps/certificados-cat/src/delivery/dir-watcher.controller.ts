import { CertificadoNaoCriadoException } from "@app/modules/modules/certificadosCat/@core/exceptions/CertificadoNaoCriado.exception";
import { ProcessaCertificadoUseCase } from "@app/modules/modules/certificadosCat/application/ProcessaCertificado.usecase";
import { ReprocessaCertificadoUseCase } from "@app/modules/modules/certificadosCat/application/ReprocessaCertificado.usecase";
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
        private reprocessaCertificadoUseCase: ReprocessaCertificadoUseCase
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
        
        const rawIgnora = this.configService.get<number>('IGNORA_CERTIFICADOS_INICIAIS', 1);
        
        const shouldIgnoreInitial = Boolean(rawIgnora);

        if (!dirPath) {
            this.logger.error('VARIAVEL CERTIFICADOS_CAT_WATCHER_DIR_PATH NÃO DEFINIDA.');
            return;
        }

        this.logger.log(`Iniciando monitoramento em: ${dirPath}`);
        this.logger.debug(`IGNORA_CERTIFICADOS_INICIAIS: ${shouldIgnoreInitial}`);

        this.watcher = chokidar.watch(dirPath, {
            persistent: true,
            ignoreInitial: shouldIgnoreInitial,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100
            },
        });

        this.watcher.on('add', (filePath) => this.handleFileEvent(filePath, 'adicionado'));
        this.watcher.on('change', (filePath) => this.handleFileEvent(filePath, 'modificado'));
        this.watcher.on('error', (error) => this.logger.error(`Erro no Watcher: ${(error as Error).message}`));
    }

    private async handleFileEvent(filePath: string, eventType: 'adicionado' | 'modificado') {
        const fullFileName = path.basename(filePath);
        
        if (!this.isValidFileName(fullFileName)) {
            this.logger.warn(`Arquivo ignorado (Padrão inválido): ${fullFileName}`);
            return;
        }

        this.logger.log(`Arquivo detectado (${eventType}): ${fullFileName}`);

        try {
            if (eventType === 'adicionado') {
                await this.processaCertificadoUseCase.execute({ filepath: filePath });
            } else {
                await this.handleModificationSafely(filePath);
            }
            
            this.logger.log(`Arquivo ${fullFileName} processado com sucesso.`);
        } catch (error) {
            this.logger.error(`Erro crítico ao processar ${fullFileName}`, (error as Error).stack);
        }
    }

    /**
     * Tenta reprocessar (atualizar). Se falhar porque não existe, cria.
     */
    private async handleModificationSafely(filePath: string) {
        try {
            await this.reprocessaCertificadoUseCase.execute({ filepath: filePath });
        } catch (error) {
            if (error instanceof CertificadoNaoCriadoException) {
                this.logger.warn(`Tentativa de modificação em arquivo não indexado. Criando agora: ${path.basename(filePath)}`);
                await this.processaCertificadoUseCase.execute({ filepath: filePath });
            } else {
                throw error;
            }
        }
    }

    private isValidFileName(fileName: string): boolean {
        const nameWithoutExt = path.parse(fileName).name;
        return /^ETH\d+$/.test(nameWithoutExt);
    }
}