import * as fs from "node:fs/promises";
import { Image } from "../../@core/classes/Image";

export class ImageRepositoryService {
    private readonly path: string = process.env.SEARCHDIR!;

    async findOne(item: string): Promise<Image> {
        if (!this.path) throw new Error('É necessário um caminho para procurar as imagens');
        try {
            const files = await fs.readdir(this.path, { withFileTypes: true });
            return files
                .filter(file => file.isFile() && file.name.indexOf(item.trim()) !== -1)
                .map(file => new Image(`${process.env.SEARCHDIR}/${file.name}`))[0];
        } catch (error) {
            console.error('Erro ao ler o diretório:', error);
            throw new Error('Erro ao ler o diretório');
        }
    }
    async find(item: string): Promise<Image[]> {
        if (!this.path) throw new Error('É necessário um caminho para procurar as imagens');
        try {
            const files = await fs.readdir(this.path, { withFileTypes: true });
            return files
                .filter(file => file.isFile() && file.name.indexOf(item.trim()) !== -1)
                .map(file => new Image(`${process.env.SEARCHDIR}/${file.name}`));
        } catch (error) {
            console.error('Erro ao ler o diretório:', error);
            throw new Error('Erro ao ler o diretório');
        }
    }
}