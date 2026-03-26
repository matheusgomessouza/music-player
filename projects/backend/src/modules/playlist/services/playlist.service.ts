import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DoublyLinkedList } from '../dsa/doubly-linked-list';
import { SongData } from '../dsa/node';
import { STORAGE_ADAPTER_TOKEN } from '../../storage/storage.module';
import { StorageAdapter } from '../../storage/adapters/storage.adapter';
import { PlaylistItemDto } from '../dtos/playlist-item.dto';

@Injectable()
export class PlaylistService implements OnModuleInit {
  private playlist: DoublyLinkedList;
  private readonly logger = new Logger(PlaylistService.name);
  private readonly metadataFile = 'playlist-metadata.json';
  private readonly uploadDir = './uploads';

  constructor(@Inject(STORAGE_ADAPTER_TOKEN) private storageAdapter: StorageAdapter) {
    this.playlist = new DoublyLinkedList();
  }

  async onModuleInit(): Promise<void> {
    await this.loadPlaylistFromMetadata();
  }

  private async loadPlaylistFromMetadata(): Promise<void> {
    this.logger.log('Loading playlist from metadata file...');
    const metadataPath = path.join(this.uploadDir, this.metadataFile);

    if (!fs.existsSync(metadataPath)) {
      this.logger.log('No metadata file found, starting with empty playlist.');
      return;
    }

    try {
      const data = fs.readFileSync(metadataPath, 'utf-8');
      const songs: SongData[] = JSON.parse(data) as SongData[];
      let count = 0;

      for (const song of songs) {
        // Optional: Check if file still exists before adding
        const fileExists = await this.storageAdapter.fileExists(song.filename);
        if (fileExists) {
          this.playlist.insertAtEnd(song);
          count++;
        } else {
          this.logger.warn(`File ${song.filename} listed in metadata but not found on storage.`);
        }
      }
      this.logger.log(`Loaded ${count} songs from metadata into playlist.`);
      // If we filtered out missing files, update the metadata file
      if (count !== songs.length) {
        this.saveMetadata();
      }
    } catch (error) {
      this.logger.error('Failed to load playlist from metadata', error);
      // Fallback or just start empty? For now, start empty if corrupt.
    }
  }

  private saveMetadata(): void {
    const metadataPath = path.join(this.uploadDir, this.metadataFile);
    const songs = this.playlist.toArray().map((item) => ({
      title: item.title,
      artist: item.artist,
      filename: item.filename,
      duration: item.duration,
    }));

    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
      fs.writeFileSync(metadataPath, JSON.stringify(songs, null, 2));
      this.logger.log('Playlist metadata saved.');
    } catch (error) {
      this.logger.error('Failed to save playlist metadata', error);
    }
  }

  getPlaylist(): PlaylistItemDto[] {
    return this.playlist.toArray();
  }

  printPlaylist(): { message: string; content: string } {
    const list = this.playlist.toArray();
    let content = '--- PLAYLIST ---\n';
    list.forEach((item, index) => {
      content += `${index + 1}. ${item.title} - ${item.artist} (${item.duration || '0:00'})\n`;
    });
    content += '----------------';

    this.logger.log(`Playlist generated for printing:\n${content}`);
    return { 
      message: 'Playlist generated successfully.',
      content 
    };
  }

  addSong(data: SongData, position?: number): PlaylistItemDto[] {
    if (position !== undefined) {
      const success = this.playlist.insertAtPosition(data, position);
      if (!success) {
        throw new BadRequestException(`Invalid position: ${position}`);
      }
    } else {
      this.playlist.insertAtEnd(data);
    }
    this.saveMetadata();
    return this.getPlaylist();
  }

  async removeByTitle(title: string): Promise<PlaylistItemDto[]> {
    const array = this.playlist.toArray();
    const item = array.find((i) => i.title === title);

    if (!item) {
      throw new NotFoundException(`Song "${title}" not found in playlist`);
    }

    const removedData = this.playlist.removeByPosition(item.position);

    if (removedData && removedData.filename) {
      try {
        await this.storageAdapter.deleteFile(removedData.filename);
      } catch (err) {
        this.logger.error(`Failed to delete file ${removedData.filename} from storage:`, err);
      }
    }

    this.saveMetadata();
    return this.getPlaylist();
  }

  async removeByPosition(position: number): Promise<PlaylistItemDto[]> {
    const removedData = this.playlist.removeByPosition(position);
    if (!removedData) {
      throw new BadRequestException(`Invalid position: ${position}`);
    }

    if (removedData.filename) {
      try {
        await this.storageAdapter.deleteFile(removedData.filename);
      } catch (err) {
        this.logger.error(`Failed to delete file ${removedData.filename} from storage:`, err);
      }
    }

    this.saveMetadata();
    return this.getPlaylist();
  }

  moveSong(fromPosition: number, toPosition: number): PlaylistItemDto[] {
    const success = this.playlist.move(fromPosition, toPosition);
    if (!success) {
      throw new BadRequestException(
        'Invalid move parameters. Ensure positions are within the playlist bounds.',
      );
    }
    this.saveMetadata();
    return this.getPlaylist();
  }
}
