import { Injectable, BadRequestException, NotFoundException, Inject, Logger } from '@nestjs/common';
import { DoublyLinkedList } from '../dsa/doubly-linked-list';
import { SongData } from '../dsa/node';
import { STORAGE_ADAPTER_TOKEN } from '../../storage/storage.module';
import { StorageAdapter } from '../../storage/adapters/storage.adapter';
import { PlaylistItemDto } from '../dtos/playlist-item.dto';

@Injectable()
export class PlaylistService {
  private playlist: DoublyLinkedList;
  private readonly logger = new Logger(PlaylistService.name);

  constructor(@Inject(STORAGE_ADAPTER_TOKEN) private storageAdapter: StorageAdapter) {
    this.playlist = new DoublyLinkedList();
  }

  getPlaylist(): PlaylistItemDto[] {
    return this.playlist.toArray();
  }

  printPlaylist(): { message: string } {
    const list = this.playlist.toArray();
    this.logger.log(`Playlist: ${JSON.stringify(list, null, 2)}`);
    return { message: 'Playlist printed to server console.' };
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

    return this.getPlaylist();
  }

  moveSong(fromPosition: number, toPosition: number): PlaylistItemDto[] {
    const success = this.playlist.move(fromPosition, toPosition);
    if (!success) {
      throw new BadRequestException(
        'Invalid move parameters. Ensure positions are within the playlist bounds.',
      );
    }
    return this.getPlaylist();
  }
}
