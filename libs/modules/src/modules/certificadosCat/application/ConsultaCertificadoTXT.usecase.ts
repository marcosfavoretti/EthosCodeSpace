import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CertificadoCatRepository } from "../infra/repository/CertificadoCat.repository";
// Adicione 'relative' na importação
import { parse, relative } from "path"; 
import { IStorageService } from "../../storage/@core/interfaces/IStorage.service";
import { EntityNotFoundError } from "typeorm";
import { ObjectId } from "mongodb";
import { ReadStream } from "fs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ConsultaCertificadoTXTUsecase {
    // Defina qual é a raiz que o seu Storage Service já usa.
    // O ideal é que isso venha de uma variável de ambiente (process.env.STORAGE_ROOT)

    constructor(
        private readonly configService: ConfigService,
        private readonly certificadoRepository: CertificadoCatRepository,
        @Inject(IStorageService) private readonly storageService: IStorageService,
    ) { }

    async consultaTXT(id: string): Promise<ReadStream> {
        try {
            const { certificadoPath } = await this.certificadoRepository.findOneOrFail({
                where: { _id: new ObjectId(id) }
            });

            const caminhoRelativo = relative(this.configService.get<string>('LOCAL_STORAGE_PATH')!, certificadoPath);

            const { dir, base } = parse(caminhoRelativo);
            
            Logger.log({ 
                full: certificadoPath, 
                relativo: caminhoRelativo, 
                pastaParaStorage: dir, 
                arquivo: base 
            });

            const stream =  await this.storageService.getStream(dir, base);
            //valida se o stream é valido
            if (!stream) {
                throw new NotFoundException('Arquivo não encontrado no storage');
            }
            return stream;
        } catch (error) {
            if (error instanceof EntityNotFoundError) throw new NotFoundException('Certificado não encontrado');
            throw new InternalServerErrorException('Falha ao buscar o arquivo');
        }
    }
}