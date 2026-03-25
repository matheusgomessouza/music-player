import { Controller, Get, Post, Body, Delete, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { PlaylistService } from '../services/playlist.service';
import { AddSongDto } from '../dtos/add-song.dto';
import { MoveSongDto } from '../dtos/move-song.dto';
import { PlaylistItemDto } from '../dtos/playlist-item.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get()
  getPlaylist(): PlaylistItemDto[] {
    return this.playlistService.getPlaylist();
  }

  @Get('print')
  printPlaylist(): { message: string } {
    return this.playlistService.printPlaylist();
  }

  @Post()
  addSong(@Body() addSongDto: AddSongDto): PlaylistItemDto[] {
    const songData = {
      title: addSongDto.title,
      artist: addSongDto.artist,
      filename: addSongDto.filename,
      duration: addSongDto.duration,
    };
    return this.playlistService.addSong(songData, addSongDto.position);
  }

  @Delete('title/:title')
  async removeByTitle(@Param('title') title: string): Promise<PlaylistItemDto[]> {
    return this.playlistService.removeByTitle(title);
  }

  @Delete('position/:position')
  async removeByPosition(
    @Param('position', ParseIntPipe) position: number,
  ): Promise<PlaylistItemDto[]> {
    return this.playlistService.removeByPosition(position);
  }

  @Patch('move')
  moveSong(@Body() moveSongDto: MoveSongDto): PlaylistItemDto[] {
    return this.playlistService.moveSong(moveSongDto.fromPosition, moveSongDto.toPosition);
  }
}
