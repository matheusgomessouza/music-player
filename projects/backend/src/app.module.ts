import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './modules/storage/storage.module';
import { PlaylistModule } from './modules/playlist/playlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    StorageModule,
    PlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
