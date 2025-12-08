import { ProcessaCertificadoDTO } from "@app/modules/contracts/dto/ProcessaCertificado.dto";
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ProcessadorCertificadoToJson } from "../@core/services/ProcessadorCertificadoToJson.service";
import { CertificadoCatRepository } from "../infra/repository/CertificadoCat.repository";

@Injectable()
export class ReprocessaCertificadoUseCase {
    constructor(
        private processador: ProcessadorCertificadoToJson,
        private certificadosRepo: CertificadoCatRepository
    ) { }

    async execute(dto: ProcessaCertificadoDTO): Promise<any> {
        const { filepath } = dto;
        try {
            // 1. Processa o arquivo para extrair os dados
            const certificadoData = await this.processador.parseFile(filepath);
            const { serianumber, rops } = certificadoData.metadata;

            if (!serianumber) {
                throw new InternalServerErrorException('Não foi possível extrair o número de série do arquivo.');
            }

            // 2. Busca o certificado existente no banco
            const certificadoExistente = await this.certificadosRepo.findOne({ where: { serialNumber: serianumber, produto: rops} });

            if (!certificadoExistente) {
                throw new NotFoundException(`Certificado com serial number ${serianumber} não encontrado para atualização.`);
            }

            // 3. Atualiza os dados do certificado existente
            const pathParts = filepath.split('/');
            const produto = pathParts[pathParts.length - 2];

            const certificadoServerTime = certificadoData.metadata.start_timestamp;
            if (!certificadoServerTime) throw new Error(`Problema ao processar data do arquivo ${filepath}`);
            const serverTime = new Date(certificadoServerTime);
            //converte o servertime para horario pt-br
            const offset = -3 * 60; // GMT-3
            serverTime.setMinutes(serverTime.getMinutes() + offset);


            certificadoExistente.produto = certificadoData.metadata.rops || produto;
            certificadoExistente.serverTime = serverTime;
            // Outros campos que precisem ser atualizados podem ser adicionados aqui

            await this.certificadosRepo.save(certificadoExistente);
            Logger.log(`Certificado ${serianumber} atualizado com sucesso.`);

            return certificadoData;

        } catch (error) {
            Logger.error(`Erro ao reprocessar o arquivo ${filepath}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Erro ao reprocessar o certificado: ' + error.message);
        }
    }
}