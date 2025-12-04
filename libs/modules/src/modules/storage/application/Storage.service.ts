import { Inject, Injectable } from '@nestjs/common';
import { IStorageService } from '../@core/interfaces/IStorage.service';
import { IStorageStrategy } from '../@core/interfaces/IStorage.strategy';
import { ReadStream } from 'fs';

@Injectable()
export class StorageService implements IStorageService {
  constructor(
    @Inject(IStorageStrategy)
    private readonly storageStrategy: IStorageStrategy,
  ) {}

  save(
    path: string,
    filename: string,
    content: Buffer,
    override?: boolean,
  ): Promise<void> {
    return this.storageStrategy.save(path, filename, content, override);
  }

  get(path: string, filename: string): Promise<Buffer> {
    return this.storageStrategy.get(path, filename);
  }

  getStream(path: string, filename: string): Promise<ReadStream> {
    return this.storageStrategy.getStream(path, filename);
  }

  delete(path: string, filename: string): Promise<void> {
    return this.storageStrategy.delete(path, filename);
  }

  list(path: string): Promise<string[]> {
    return this.storageStrategy.list(path);
  }
}
