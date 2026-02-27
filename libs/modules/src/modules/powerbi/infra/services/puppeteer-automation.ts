import { Browser, ElementHandle, launch, LaunchOptions, Page, TimeoutError } from "puppeteer";
import { IWebAutomation } from "../../@core/interfaces/web-automation.abstract";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PuppeteerAutomation implements IWebAutomation {
    private currentPage?: Page;
    private browser?: Browser;
    private configuration: LaunchOptions;
    
    constructor(private configService: ConfigService) {
        this.configuration = {
            headless: !!Number(this.configService.get<number>('HEADLESS_BROWSER', 1)),
            defaultViewport: { height: 900, width: 900 },
            args: [
                '--disable-gpu',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--enable-features=NetworkService',
            ],
        };
    }

    private async checkToolsToSearch(): Promise<void> {
        try {
            if (!this.browser) {
                this.browser = await launch(this.configuration);
                this.browser.on('disconnected', () => {
                    this.browser = undefined;
                    this.currentPage = undefined;
                });
            }
            if (!this.currentPage) {
                this.currentPage = await this.browser.newPage();
                await this.currentPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                this.currentPage.on('close', () => {
                    this.currentPage = undefined;
                });
            }
        } catch (error) {
            console.error('Erro detalhado do Puppeteer:', error);
            throw new Error('não foi possível instanciar as ferramentas de automação');
        }
    }

    async navigate(url: string): Promise<void> {
        await this.checkToolsToSearch();
        try {
            // 'load' é mais seguro para o Power BI que 'networkidle2' devido ao excesso de telemetria em segundo plano
            await this.currentPage!.goto(url, { waitUntil: 'load', timeout: 60000 });
        } catch (error) {
            // Ignora ERR_ABORTED pois o Power BI costuma abortar navegações durante redirecionamentos de SSO
            if (error.message.includes('net::ERR_ABORTED')) {
                console.warn(`Navegação para ${url} reportou aborto, prosseguindo...`);
                return;
            }
            throw error;
        }
    }

    async waitElement(selector: string, timeout: number = 8000): Promise<any> {
        try {
            await this.checkToolsToSearch();
            const element = await this.currentPage!.waitForSelector(selector, { visible: true, timeout });
            
            if (!element) return null;

            // Corrigido: Usar element.evaluate para evitar erro de "JavaScript world"
            const isDisabled = await element.evaluate((el: any) => el.hasAttribute('disabled'));
            
            if (isDisabled) return null;
            
            return element;
        } catch (err) {
            if (err instanceof TimeoutError) return null;
            console.error(`Erro ao aguardar elemento ${selector}:`, err);
            throw err;
        }
    }

    async type(element: ElementHandle, text: string): Promise<void> {
        if (!element) throw new Error("Elemento não definido para digitação");
        await element.type(text);
    }

    async click(element: ElementHandle): Promise<void> {
        if (!element) throw new Error("Elemento não definido para clique");
        await element.click();
    }

    async reloadPage(): Promise<void> {
        if (this.currentPage) await this.currentPage.reload({ waitUntil: 'networkidle2' });
    }

    async waitElementDisappear(selector: string, timeout: number = 300000): Promise<void> {
        try {
            await this.checkToolsToSearch();
            await this.currentPage!.waitForSelector(selector, { hidden: true, timeout });
        } catch (error) {
            console.error(`Erro ao aguardar desaparecimento do elemento ${selector}:`, error);
            throw error;
        }
    }

    async closeAll(): Promise<void> {
        if (this.currentPage) {
            await this.currentPage.close();
            this.currentPage = undefined;
        }
        if (this.browser) {
            await this.browser.close();
            this.browser = undefined;
        }
    }
}
