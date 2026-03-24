import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DoublyLinkedList } from '../dsa/doubly-linked-list';

@Injectable()
export class PlaylistService {
  private playlist: DoublyLinkedList;

  constructor() {
    this.playlist = new DoublyLinkedList();

    // Adding some seed data for demonstration
    this.playlist.insertAtEnd('Seek and Destroy');
    this.playlist.insertAtEnd('Rock and Roll Ain’t Noise Pollution');
    this.playlist.insertAtEnd('Sabbath Bloody Sabbath');
    this.playlist.insertAtEnd('Good Times Bad Times');
  }

  getPlaylist() {
    return this.playlist.toArray();
  }

  printPlaylist() {
    this.playlist.print();
    return { message: 'Playlist printed to server console.' };
  }

  addSong(title: string, position?: number) {
    if (position !== undefined) {
      const success = this.playlist.insertAtPosition(title, position);
      if (!success) {
        throw new BadRequestException(`Invalid position: ${position}`);
      }
    } else {
      this.playlist.insertAtEnd(title);
    }
    return this.getPlaylist();
  }

  removeByTitle(title: string) {
    const success = this.playlist.removeByTitle(title);
    if (!success) {
      throw new NotFoundException(`Song "${title}" not found in playlist`);
    }
    return this.getPlaylist();
  }

  removeByPosition(position: number) {
    const removedTitle = this.playlist.removeByPosition(position);
    if (!removedTitle) {
      throw new BadRequestException(`Invalid position: ${position}`);
    }
    return this.getPlaylist();
  }

  moveSong(fromPosition: number, toPosition: number) {
    const success = this.playlist.move(fromPosition, toPosition);
    if (!success) {
      throw new BadRequestException(
        'Invalid move parameters. Ensure positions are within the playlist bounds.',
      );
    }
    return this.getPlaylist();
  }
}
