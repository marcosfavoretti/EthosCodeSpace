import { ReadStream } from 'fs';
export const IStorageStrategy = Symbol('IStorageStrategy');
export interface IStorageStrategy {
  save(
    path: string,
    filename: string,
    content: Buffer,
    override?: boolean,
  ): Promise<void>;
  get(path: string, filename: string): Promise<Buffer>;
  getStream(path: string, filename: string): Promise<ReadStream>;
  delete(path: string, filename: string): Promise<void>;
  list(path: string): Promise<string[]>;
}
