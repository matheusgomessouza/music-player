import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrackService } from '../services/track.service';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { TrackResponseDto } from '../dtos/track-response.dto';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { Inject } from '@nestjs/common';
import { STORAGE_ADAPTER_TOKEN } from '../../storage/storage.module';
import { StorageAdapter } from '../../storage/adapters/storage.adapter';

@ApiTags('tracks')
@Controller('api/v1/tracks')
export class TrackController {
  constructor(
    private trackService: TrackService,
    @Inject(STORAGE_ADAPTER_TOKEN) private storageAdapter: StorageAdapter,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a new track' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTrack(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTrackDto: CreateTrackDto,
  ): Promise<TrackResponseDto> {
    return this.trackService.uploadTrack(file, createTrackDto);
  }

  @Get('stream/:filename')
  @ApiOperation({ summary: 'Stream track file' })
  async streamTrack(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const trackFile = await this.trackService.getTrackFile(filename);
    const stream = await this.storageAdapter.getFile(trackFile.filename);

    res.set({
      'Content-Type': trackFile.mimeType,
      'Content-Disposition': `inline; filename="${trackFile.filename}"`,
    });

    stream.pipe(res);
  }
}
