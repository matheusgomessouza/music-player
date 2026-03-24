import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageAdapter } from './adapters/storage.adapter';
import { LocalStorageAdapter } from './adapters/local-storage.adapter';
import { S3StorageAdapter } from './adapters/s3-storage.adapter';

export const STORAGE_ADAPTER_TOKEN = 'STORAGE_ADAPTER';

@Module({
  providers: [
    {
      provide: STORAGE_ADAPTER_TOKEN,
      useFactory: (configService: ConfigService): StorageAdapter => {
        const storageType = configService.get<string>('STORAGE_TYPE', 'local');

        if (storageType === 's3') {
          return new S3StorageAdapter({
            region: configService.get<string>('AWS_REGION', 'us-east-1'),
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            bucket: configService.get<string>('AWS_S3_BUCKET'),
            endpoint: configService.get<string>('AWS_S3_ENDPOINT'),
            forcePathStyle: configService.get<boolean>('AWS_S3_FORCE_PATH_STYLE', false),
          });
        }

        // Default to local storage
        return new LocalStorageAdapter({
          uploadDir: configService.get<string>('UPLOAD_DIR', './uploads'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [STORAGE_ADAPTER_TOKEN],
})
export class StorageModule {}
