import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import puppeteer, { Browser } from "puppeteer"
@Injectable()
export class PdfService implements OnModuleInit {
    private browser: Browser;
    private readonly logger = new Logger(PdfService.name);

    async onModuleInit() {
        this.logger.log('Inicializando instância do navegador Puppeteer...');
        this.browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necessário para rodar em Docker/Linux
        });
        this.logger.log('Instância do navegador pronta.');
    }

    async onModuleDestroy() {
        this.logger.log('Fechando instância do navegador.');
        // await this.browser.close();
    }

    /**
     * Gera um PDF a partir de um conteúdo HTML.
     * Esta função é MUITO RÁPIDA, pois o navegador já está aberto.
     */
    async gerarPdf(htmlContent: string): Promise<Buffer> {
        const page = await this.browser.newPage();
        try {
            // Define o conteúdo da página
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0', // Espera a rede ficar ociosa (se seu HTML carregar imagens/fontes externas)
            });

            // Gera o PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
            });

            return Buffer.from(pdfBuffer);
        } 
        finally {
            // Fecha a *página* (mas não o *navegador*)
            await page.close();
        }
    }
}