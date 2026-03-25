import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrackService } from '../services/track.service';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { TrackResponseDto } from '../dtos/track-response.dto';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { Response, Request } from 'express';
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
  @ApiOperation({ summary: 'Stream track file with range support' })
  async streamTrack(
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const trackFile = await this.trackService.getTrackFile(filename);
    const fileSize = trackFile.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res
          .status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
          .send('Requested range not satisfiable');
        return;
      }

      const chunkSize = end - start + 1;
      const fileStream = await this.storageAdapter.getFile(trackFile.filename, start, end);

      res.status(HttpStatus.PARTIAL_CONTENT).set({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': trackFile.mimeType,
      });

      fileStream.pipe(res);
    } else {
      res.set({
        'Content-Length': fileSize,
        'Content-Type': trackFile.mimeType,
      });
      const stream = await this.storageAdapter.getFile(trackFile.filename);
      stream.pipe(res);
    }
  }
}
