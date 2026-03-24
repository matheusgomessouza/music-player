import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { StorageAdapter } from './storage.adapter';

export interface S3StorageConfig {
  accessKeyId?: string;
  secretAccessKey?: string;
  bucket?: string;
  region?: string;
  endpoint?: string;
  forcePathStyle?: boolean;
}

@Injectable()
export class S3StorageAdapter implements StorageAdapter {
  constructor(private config: S3StorageConfig) {}

  async uploadFile(key: string, _buffer: Buffer, _mimetype: string): Promise<string> {
    return Promise.resolve(`s3://${this.config.bucket}/${key}`);
  }

  async downloadFile(_key: string): Promise<Buffer> {
    return Promise.resolve(Buffer.from(''));
  }

  async getFile(_key: string): Promise<Readable> {
    return Promise.resolve(new Readable());
  }

  async deleteFile(_key: string): Promise<void> {
    return Promise.resolve();
  }

  async fileExists(_key: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  async getFileUrl(key: string): Promise<string> {
    return Promise.resolve(`https://${this.config.bucket}.s3.amazonaws.com/${key}`);
  }
}
