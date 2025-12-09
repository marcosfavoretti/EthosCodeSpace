import { ProcessaCertificadoDTO } from "@app/modules/contracts/dto/ProcessaCertificado.dto";
import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ProcessadorCertificadoToJson } from "../@core/services/ProcessadorCertificadoToJson.service";
import { CertificadoCatRepository } from "../infra/repository/CertificadoCat.repository";
import path from "node:path";

@Injectable()
export class ProcessaCertificadoUseCase {
    constructor(
        private processador: ProcessadorCertificadoToJson,
        private certificadosRepo: CertificadoCatRepository
    ) { }

    async execute(dto: ProcessaCertificadoDTO): Promise<any> {
        try {
            const { filepath } = dto;

            // 1. Processa o arquivo (Lê o TXT e transforma em JSON)
            const certificadoData = await this.processador.parseFile(filepath);

            const { serianumber, rops, start_timestamp } = certificadoData.metadata;
            if (!serianumber) {
                throw new InternalServerErrorException('Não foi possível extrair o número de série do arquivo.');
            }
            if (!rops) {
                throw new BadRequestException(`Arquivo ${filepath} não contém a informação de ROP's.`);
            }
            if (!start_timestamp) {
                throw new BadRequestException(`Arquivo ${filepath} não contém a informação de data/hora de início.`);
            }

            // 2. Verifica se o certificado já existe
            const certificadoExistente = await this.certificadosRepo.findOne({ where: { serialNumber: serianumber, produto: rops } });
            if (certificadoExistente) {
                throw new ConflictException(`Certificado com serial number ${serianumber} já existe e não pode ser processado como novo.`);
            }

            // 3. Prepara os dados para salvar
            const certificadoServerTime = start_timestamp;
            if (!certificadoServerTime) throw new Error(`Problema ao processar data do arquivo ${filepath}`);
            const serverTime = new Date(certificadoServerTime);
            //converte o servertime para horario pt-br
            const offset = -3 * 60; // GMT-3
            serverTime.setMinutes(serverTime.getMinutes() + offset);

            Logger.log(serverTime);

            // const pathParts = filepath.split('/');
            // console.log(pathParts)
            // const produto = pathParts[pathParts.length - 2];
            const pastaDoArquivo = path.dirname(filepath);
            const produto = path.basename(pastaDoArquivo);
            // const serialNumber = pathParts[pathParts.length - 1]; // Já extraído acima
            
            console.log({
                serianumber, 
                filepath,
                produto,
                rops, 
                start_timestamp,
            })


            if (!produto) { // serialNumber já foi verificado
                throw new Error(`Problema ao processar nome do produto ${produto}`);
            }

            // Cria uma nova instância da entidade
            const novoCertificado = this.certificadosRepo.create({
                certificadoPath: `/${produto}/${serianumber}.txt`,
                produto: certificadoData.metadata.rops!,
                serialNumber: serianumber, // Usar o serialNumber extraído
                serverTime,
            });

            await this.certificadosRepo.save(novoCertificado);
            Logger.log(`Novo certificado ${serianumber} processado com sucesso.`);

            // 4. Retorna os dados processados para quem chamou a API
            return certificadoData;
        } catch (error) {
            Logger.error(`Erro ao processar arquivo ${dto.filepath}`, error.stack);
            if (error.code === 'ENOENT') {
                throw new BadRequestException('Arquivo não encontrado: ' + dto.filepath);
            }
            if (error.code === 'EACCES') {
                throw new ForbiddenException('Sem permissão para ler o arquivo: ' + dto.filepath);
            }
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Erro ao processar o certificado: ' + error.message);
        }
    }
}