import { IWebAutomation } from "../../@core/interfaces/web-automation.abstract";
import { IPowerbiAtualizador } from "../../@core/interfaces/powerbi-atualizador.abstract";
import { BadRequestException, Inject, InternalServerErrorException, Injectable, Logger } from "@nestjs/common";
import { PowerbiDatasets } from "../../@core/entities/PowerbiDatasets.entity";
import { POWERBIURL } from "../../@core/enum/PowerbiUrl.enum";
import { AlreadyRefreshing } from "../../@core/exceptions/already-refreshing.exception";
import { ProblensOnRefresh } from "../../@core/exceptions/problens-on-refresh.exception";
import { DoesntRefresing } from "../../@core/exceptions/doesnt-refreshing.exeception";
import { ConfigService } from "@nestjs/config";
import { IPowerbiRefreshObserver } from "../../@core/interfaces/IPowerbiRefreshObserver";

@Injectable()
export class PowerbiAtualizadorService implements IPowerbiAtualizador {
    constructor(
        @Inject(IWebAutomation) private automation: IWebAutomation,
        private configService: ConfigService,
    ) { }

    async refreshPowerbi(dataset: PowerbiDatasets, ws?: IPowerbiRefreshObserver) {
        try {
            ws?.emit(`atualizando o dataset ${dataset.name}`);
            Logger.debug(`Iniciando atualização do dataset: ${dataset.name}`, PowerbiAtualizadorService.name);
            await this.automation.navigate(POWERBIURL.AUTH);
            await this.makeLogin();
            ws?.emit('autenticando');
            await this.automation.navigate(dataset.urlDataset);
            ws?.emit(`requisitando atualização do dataset: ${dataset.name}`);
            await this.requestRefresh();
            ws?.emit(`esperando final da atualização do dataset ${dataset.name}`);
            await this.waitRefreshEnd();
            ws?.emit('atualizado com sucesso!');
            await this.handleIconWarningPosRefreshApper();
            Logger.debug(`Atualização do dataset ${dataset.name} concluída com sucesso.`, PowerbiAtualizadorService.name);
        } catch (err) {
            this.handleError(dataset.name, err);
        } finally {
            await this.automation.closeAll();
        }
    }

    private async handleIconWarningPosRefreshApper() {
        const icon_selector = `#content > tri-shell > tri-item-renderer > tri-extension-page-outlet > div:nth-child(2) > dataset-details-container > section > section > artifact-information > section > artifact-details-card > mat-card > mat-card-content > div.details-container.no-expander > artifact-details-field > mat-card-subtitle > section.field-info > dataset-icon-container-modern > span > button > i`
        const icon = await this.automation.waitElement(
            icon_selector
        )
        if (icon) throw new ProblensOnRefresh('Problema com a atualização do dataset!')
    }


    private async makeLogin() {
        const email = this.configService.getOrThrow<string>('POWERBIEMAIL');
        const password = this.configService.getOrThrow<string>('POWERBISENHA');

        if (!email || !password) {
            throw new InternalServerErrorException('Credenciais do PowerBI não configuradas no ConfigService');
        }

        const emailInput = await this.automation.waitElement('#email');
        if (emailInput) {
            await this.automation.type(emailInput, email);
            const submitBtn = await this.automation.waitElement('#submitBtn');
            if (submitBtn) await this.automation.click(submitBtn);
        }

        const passInput = await this.automation.waitElement('#i0118');
        if (passInput) {
            await this.automation.type(passInput, password);
            const submitBtn = await this.automation.waitElement('#idSIButton9');
            if (submitBtn) await this.automation.click(submitBtn);
        }

        const keepBtn = await this.automation.waitElement('#idSIButton9');
        if (keepBtn) await this.automation.click(keepBtn);
        //tem que esperar 5000 para ele conseguir bular os redirecionamentos
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    private async requestRefresh() {
        try {
            await this.openDropDownMenu();
            await new Promise((resolve) => setTimeout(resolve, 2500));
            await this.clickBtnRefresh();
            await new Promise((resolve) => setTimeout(resolve, 5_000));
            // Passa o seletor do loader para garantir que a página está pronta após o reload
            // Isso evita o erro "Execution context was destroyed"
            await this.automation.reloadPage('#content spinner');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    private async openDropDownMenu() {
        try {
            const dropdown_menu = await this.automation.waitElement(`#model-actionbar-refresh`);
            await this.automation.click(dropdown_menu)
        } catch (error) {
            // Ignora erro de contexto destruído pois pode ser causado por navegação após clique
            if (error.message.includes('Execution context was destroyed') ||
                error.message.includes('Node is detached from document')) {
                console.warn('Menu dropdown aberto mas contexto foi destruído pela navegação da página');
                return;
            }
            Logger.log('nao foi possível abrir o menu');
            throw error;
        }
    }

    private async clickBtnRefresh(tryNumber: number = 1): Promise<void> {
        try {

            console.log(`Tentativa de busca pelo botão de atualização: ${tryNumber}`);
            if (tryNumber > 9) throw new DoesntRefresing('O botão de atualizar do PowerBI não foi detectado no portal');
            const selector = `#mat-menu-panel-${tryNumber} > div > span:nth-child(1) > button`;
            const btn_refresh = await this.automation.waitElement(selector);
            await new Promise(resolve => setTimeout(resolve, 1_000));
            if (btn_refresh) {
                await this.automation.click(btn_refresh);
                return;
            }
            await this.clickBtnRefresh(tryNumber + 1);
        } catch (error) {
            // Ignora erro de contexto destruído pois o clique pode disparar navegação no Power BI
            if (error.message.includes('Execution context was destroyed') ||
                error.message.includes('Node is detached from document')) {
                console.warn('Botão de refresh clicado mas contexto foi destruído pela navegação da página');
                return;
            }
            console.log('não foi possível clicar para atualizar o dataset');
            throw error;
        }
    }

    private async waitRefreshEnd() {
        const loaderSelector = '#content spinner';
        const isRefreshing = await this.automation.waitElement(loaderSelector);
        if (isRefreshing) {
            await this.automation.waitElementDisappear(loaderSelector);
        }
    }

    private handleError(datasetName: string, err: any) {
        Logger.error(`Erro ao atualizar dataset ${datasetName}:`, err);

        if (err instanceof AlreadyRefreshing) {
            throw new BadRequestException(`${datasetName}: ${err.message}`);
        }
        if (err instanceof ProblensOnRefresh || err instanceof DoesntRefresing) {
            throw new InternalServerErrorException(`${datasetName}: ${err.message}`);
        }
        throw new InternalServerErrorException(`${datasetName}: Erro inesperado na automação - ${err.message}`);
    }
}
