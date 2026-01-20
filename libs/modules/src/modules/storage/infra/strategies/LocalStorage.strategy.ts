import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { constants } from 'node:fs';
import * as path from 'node:path';
import { createReadStream, ReadStream } from 'fs';
import { IStorageStrategy } from '../../@core/interfaces/IStorage.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStorageStrategy implements IStorageStrategy {
  private readonly logger = new Logger(LocalStorageStrategy.name);
  private config!: { path: string };

  constructor(private readonly configService: ConfigService) {
    const path = configService.get<string>('LOCAL_STORAGE_PATH')!;
    if (!path) throw new Error('caminho do storage local nao foi passado');
    this.config = {
      path: path,
    };
  }

  private getRootPath() {
    return this.config.path;
  }

  private async checkPathExists(path: string) {
    try {
      await fs.access(path, constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async createPath(fullPath: string) {
    const pathExists = await this.checkPathExists(fullPath);
    if (!pathExists) {
      await fs.mkdir(fullPath, { recursive: true });
    }
  }

  async save(
    folder: string,
    filename: string,
    content: Buffer,
    override = false,
  ): Promise<void> {
    const root = this.getRootPath();
    const fullPath = path.join(root, folder);
    await this.createPath(fullPath);

    const filePath = path.join(fullPath, filename);

    const fileExists = await this.checkPathExists(filePath);

    if (fileExists && !override) {
      this.logger.warn(`File ${filePath} already exists. Set override to true`);
      return;
    }

    await fs.writeFile(filePath, content);
  }

  async get(folder: string, filename: string): Promise<Buffer> {
    const root = this.getRootPath();
    const filePath = path.join(root, folder, filename);

    return fs.readFile(filePath);
  }

  async getStream(folder: string, filename: string): Promise<ReadStream> {
    const root = this.getRootPath();
    const filePath = path.join(root, folder, filename);
    /**verifica se o arquivo existe */
    Logger.debug(`arquivo ${filePath} requisitado`);
    const fileExists = await this.checkPathExists(filePath);
    if (!fileExists) {
      this.logger.warn(`File not found: ${filePath}`);
      throw new Error('Arquivo não existe');
    }
    return createReadStream(filePath);
  }

  async delete(folder: string, filename: string): Promise<void> {
    const root = this.getRootPath();
    const filePath = path.join(root, folder, filename);

    await fs.unlink(filePath);
  }

  async list(folder: string): Promise<string[]> {
    const root = this.getRootPath();
    const fullPath = path.join(root, folder);

    return fs.readdir(fullPath);
  }
}
