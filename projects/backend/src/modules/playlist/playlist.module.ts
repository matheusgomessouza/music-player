import { Module } from '@nestjs/common';
import { PlaylistController } from './controllers/playlist.controller';
import { PlaylistService } from './services/playlist.service';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
