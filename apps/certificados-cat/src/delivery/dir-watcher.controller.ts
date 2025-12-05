import { ProcessaCertificadoUseCase } from "@app/modules/modules/certificadosCat/application/ProcessaCertificado.usecase";
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as chokidar from 'chokidar';
import * as path from 'path'; // <--- Importante para extrair o nome do arquivo

@Injectable()
export class DirWatcherService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DirWatcherService.name);
    private watcher: chokidar.FSWatcher;

    constructor(
        private configService: ConfigService,
        private processaCertificadoUseCase: ProcessaCertificadoUseCase
    ) { }

    // Inicia o watcher assim que o módulo sobe
    onModuleInit() {
        this.setupTriggers();
    }

    // Fecha o watcher quando a aplicação desliga para evitar memory leaks
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

        // Configuração do Chokidar
        this.watcher = chokidar.watch(dirPath, {
            persistent: true,
            ignoreInitial: true, // true = processa apenas arquivos NOVOS (ignora os que já estavam lá ao iniciar)
            awaitWriteFinish: {
                stabilityThreshold: 2000, // Espera 2s sem mudanças no tamanho do arquivo para garantir que a cópia terminou
                pollInterval: 100
            },
        });

        // Evento 'add': Disparado quando um arquivo é adicionado
        this.watcher.on('add', async (filePath) => {
            const fileName = path.parse(filePath).name;
            const fullFileName = path.basename(filePath); // Nome com extensão para logs

            // 2. Regex de Validação
            // ^ETH = Começa obrigatoriamente com ETH
            // \d+  = Seguido de um ou mais dígitos numéricos (0-9)
            // $    = Fim da string (garante que não tem letras depois)
            const pattern = /^ETH\d+$/;

            if (!pattern.test(fileName)) {
                this.logger.warn(`Arquivo ignorado (Padrão inválido): ${fullFileName}. Esperado: ETH + Números.`);
                return;
            }

            this.logger.log(`Novo arquivo válido detectado: ${fullFileName}`);

            try {
                // Chama o UseCase
                await this.processaCertificadoUseCase.execute({ filepath: filePath });
                this.logger.log(`Arquivo processado com sucesso: ${fullFileName}`);
            } catch (error) {
                this.logger.error(`Erro ao processar arquivo ${fullFileName}`, (error as Error).stack);
            }
        });

        this.watcher.on('error', (error) => {
            this.logger.error(`Erro no Watcher: ${(error as Error).message}`);
        });
    }
}