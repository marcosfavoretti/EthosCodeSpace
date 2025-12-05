import { ProcessaCertificadoDTO } from "@app/modules/contracts/dto/ProcessaCertificado.dto";
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ProcessadorCertificadoToJson } from "../@core/services/ProcessadorCertificadoToJson.service";
import { CertificadoCatRepository } from "../infra/repository/CertificadoCat.repository";

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

            // 2. Salva no banco de dados
            // Certifique-se que o nome das propriedades aqui batem com a sua Entity do TypeORM
            const certificadoServerTime = certificadoData.metadata.start_timestamp;
            const serverTime = certificadoServerTime ? new Date(certificadoServerTime) : new Date(0);
 
            /**pega a ultima pasta onde esta o arquivo e o nome do arquivo apeans ex: C:/cabA/testea.txt -> /cabA/testea.txt*/
            const pathParts = filepath.split('/');
            const produto = pathParts[pathParts.length - 2];
            const serialNumber = pathParts[pathParts.length - 1];
            

            await this.certificadosRepo.save({
                certificadoPath: `/${produto}/${serialNumber}`,
                produto: certificadoData.metadata.rops!,
                serialNumber: certificadoData.metadata.serianumber!,
                serverTime,
            });
            // 3. Retorna os dados processados para quem chamou a API
            return certificadoData;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new BadRequestException('Arquivo não encontrado: ' + dto.filepath);
            }
            if (error.code === 'EACCES') {
                throw new ForbiddenException('Sem permissão para ler o arquivo: ' + dto.filepath);
            }
            console.error(error);
            throw new InternalServerErrorException('Erro ao processar o certificado: ' + error.message);
        }
    }
}