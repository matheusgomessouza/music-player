import { Readable } from 'stream';

export interface StorageConfig {
  [key: string]: string | number | boolean;
}

export abstract class StorageAdapter {
  abstract uploadFile(key: string, buffer: Buffer, mimetype: string): Promise<string>;

  abstract downloadFile(key: string): Promise<Buffer>;

  abstract getFile(key: string): Promise<Readable>;

  abstract deleteFile(key: string): Promise<void>;

  abstract fileExists(key: string): Promise<boolean>;

  abstract getFileUrl(key: string): Promise<string>;
}
