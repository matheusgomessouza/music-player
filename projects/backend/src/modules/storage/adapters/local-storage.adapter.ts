import { StorageAdapter, StorageConfig } from './storage.adapter';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';

interface LocalStorageConfig extends StorageConfig {
  uploadDir: string;
}

@Injectable()
export class LocalStorageAdapter extends StorageAdapter {
  private uploadDir: string;

  constructor(config: LocalStorageConfig) {
    super();
    this.uploadDir = config.uploadDir || './uploads';

    // Create upload directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(key: string, buffer: Buffer, _mimetype?: string): Promise<string> {
    // mimetype is optional and unused in local storage
    const filePath = path.join(this.uploadDir, key);
    const dir = path.dirname(filePath);

    // Create directory structure if needed
    if (!fs.existsSync(dir)) {
      await fsPromises.mkdir(dir, { recursive: true });
    }

    await fsPromises.writeFile(filePath, buffer);
    return key;
  }

  async downloadFile(key: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, key);
    return await fsPromises.readFile(filePath);
  }

  async getFile(key: string): Promise<Readable> {
    const filePath = path.join(this.uploadDir, key);
    // There is no await for createReadStream, so we can just return it. To satisfy eslint, we can await a resolve or just keep it without async. Wait, the base class requires it to be async.
    return Promise.resolve(fs.createReadStream(filePath));
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath);
    }
  }

  async fileExists(key: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, key);
    try {
      await fsPromises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileUrl(key: string): Promise<string> {
    // For local storage, return the relative path
    return Promise.resolve(`/uploads/${key}`);
  }
}
