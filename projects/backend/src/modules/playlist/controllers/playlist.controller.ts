import { Controller, Get, Post, Body, Delete, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { PlaylistService } from '../services/playlist.service';
import { AddSongDto } from '../dtos/add-song.dto';
import { MoveSongDto } from '../dtos/move-song.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get()
  getPlaylist() {
    return this.playlistService.getPlaylist();
  }

  @Get('print')
  printPlaylist() {
    return this.playlistService.printPlaylist();
  }

  @Post()
  addSong(@Body() addSongDto: AddSongDto) {
    return this.playlistService.addSong(addSongDto.title, addSongDto.position);
  }

  @Delete('title/:title')
  removeByTitle(@Param('title') title: string) {
    return this.playlistService.removeByTitle(title);
  }

  @Delete('position/:position')
  removeByPosition(@Param('position', ParseIntPipe) position: number) {
    return this.playlistService.removeByPosition(position);
  }

  @Patch('move')
  moveSong(@Body() moveSongDto: MoveSongDto) {
    return this.playlistService.moveSong(moveSongDto.fromPosition, moveSongDto.toPosition);
  }
}
