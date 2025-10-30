import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import puppeteer, { Browser } from "puppeteer"

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy { // <-- 1. IMPLEMENTA OnModuleDestroy
    private browser: Browser | null;
    private readonly logger = new Logger(PdfService.name);

    async onModuleInit() {
        this.logger.log('Inicializando instância do navegador Puppeteer...');
        this.browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Recomendado para ambientes Docker
                '--single-process' // Pode ajudar em ambientes com poucos recursos
            ],
        });
        this.logger.log('Instância do navegador pronta.');
    }

    // <-- 2. MÉTODO ADICIONADO PARA FECHAR O NAVEGADOR -->
    /**
     * Garante que o navegador seja fechado quando o módulo for destruído (ex: shutdown do worker).
     * Isso é crucial para prevenir vazamentos de memória e processos "zumbis" do Chrome.
     */
    async onModuleDestroy() {
        this.logger.log('Fechando instância do navegador Puppeteer...');
        if (this.browser) {
            await this.browser.close();
            this.browser = null; // Ajuda o Garbage Collector
        }
        this.logger.log('Navegador fechado.');
    }

    /**
     * Gera um PDF a partir de um conteúdo HTML.
     * Esta função é MUITO RÁPIDA, pois o navegador já está aberto.
     */
    async gerarPdf(htmlContent: string): Promise<Buffer> {
        if (!this.browser) {
            this.logger.error('Navegador não inicializado. Gerar PDF falhou.');
            throw new Error('Instância do navegador Puppeteer não está inicializada ou já foi destruída.');
        }

        const page = await this.browser.newPage();
        try {
            // Define o conteúdo da página
            await page.setContent(htmlContent, {
                // waitUntil: 'networkidle0', // <-- CAUSA DO TIMEOUT
                waitUntil: 'load', // <-- 3. CORRIGIDO: 'load' é o correto para HTML local
                timeout: 60000,
            });

            // Gera o PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
            });

            // return Buffer.from(pdfBuffer); // <-- 4. REMOVIDO: Redundante, page.pdf() já retorna Buffer
            return Buffer.from(pdfBuffer);
        }
        catch (error) {
            // <-- 5. ADICIONADO: Log detalhado do erro antes de propagá-lo
            this.logger.error(`Falha ao gerar PDF: ${error.message}`, error.stack);
            throw error; // Propaga o erro para o GerarNotaUseCase
        }
        finally {
            // Fecha a *página* (mas não o *navegador*)
            await page.close();
        }
    }
}