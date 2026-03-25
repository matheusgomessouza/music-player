import { Module } from '@nestjs/common';
import { PlaylistController } from './controllers/playlist.controller';
import { PlaylistService } from './services/playlist.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
