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

  async getFile(key: string, start?: number, end?: number): Promise<Readable> {
    const filePath = path.join(this.uploadDir, key);
    return Promise.resolve(fs.createReadStream(filePath, { start, end }));
  }

  async getFileSize(key: string): Promise<number> {
    const filePath = path.join(this.uploadDir, key);
    try {
      const stats = await fsPromises.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
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

  async listFiles(directory?: string): Promise<string[]> {
    const dirPath = directory ? path.join(this.uploadDir, directory) : this.uploadDir;
    try {
      const files = await fsPromises.readdir(dirPath);
      // Filter out directories, keeping only files
      const fileList = [];
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fsPromises.stat(filePath);
        if (stat.isFile()) {
          fileList.push(file);
        }
      }
      return fileList;
    } catch (error: unknown) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
}
