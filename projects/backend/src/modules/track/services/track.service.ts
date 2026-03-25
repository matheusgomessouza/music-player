import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { STORAGE_ADAPTER_TOKEN } from '../../storage/storage.module';
import { StorageAdapter } from '../../storage/adapters/storage.adapter';
import { TrackResponseDto } from '../dtos/track-response.dto';

@Injectable()
export class TrackService {
  constructor(@Inject(STORAGE_ADAPTER_TOKEN) private storageAdapter: StorageAdapter) {}

  async uploadTrack(
    file: Express.Multer.File,
    createTrackDto: CreateTrackDto,
  ): Promise<TrackResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const filename = `${Date.now()}-${file.originalname}`;
    await this.storageAdapter.uploadFile(filename, file.buffer, file.mimetype);

    return {
      title: createTrackDto.title,
      artist: createTrackDto.artist,
      filename,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async getTrackFile(
    filename: string,
  ): Promise<{ filename: string; mimeType: string; size: number }> {
    const exists = await this.storageAdapter.fileExists(filename);

    if (!exists) {
      throw new NotFoundException(`File ${filename} not found`);
    }

    const size = await this.storageAdapter.getFileSize(filename);

    return {
      filename,
      mimeType: 'audio/mpeg', // basic fallback
      size,
    };
  }
}
