import { Module } from '@nestjs/common';
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.service';
import { TrackRepository } from './repositories/track.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
  exports: [TrackService],
})
export class TrackModule {}
