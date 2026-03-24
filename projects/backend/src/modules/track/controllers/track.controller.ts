import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrackService } from '../services/track.service';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { UpdateTrackDto } from '../dtos/update-track.dto';
import { TrackDto } from '../dtos/track.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201, description: 'Track uploaded successfully', type: TrackDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadTrack(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTrackDto: CreateTrackDto,
  ): Promise<TrackDto> {
    return this.trackService.uploadTrack(file, createTrackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({ status: 200, description: 'List of all tracks', type: [TrackDto] })
  async getAllTracks(
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ): Promise<TrackDto[]> {
    return this.trackService.getAllTracks(
      take ? parseInt(take, 10) : undefined,
      skip ? parseInt(skip, 10) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by ID' })
  @ApiResponse({ status: 200, description: 'Track details', type: TrackDto })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async getTrackById(@Param('id') id: string): Promise<TrackDto> {
    return this.trackService.getTrackById(id);
  }

  @Get(':id/stream')
  @ApiOperation({ summary: 'Stream track file' })
  @ApiResponse({ status: 200, description: 'Track file stream' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async streamTrack(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const trackFile = await this.trackService.getTrackFile(id);
    const stream = await this.storageAdapter.getFile(trackFile.filename);

    res.set({
      'Content-Type': trackFile.mimeType,
      'Content-Disposition': `inline; filename="${trackFile.filename}"`,
    });

    stream.pipe(res);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update track metadata' })
  @ApiResponse({ status: 200, description: 'Track updated successfully', type: TrackDto })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<TrackDto> {
    return this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete track' })
  @ApiResponse({ status: 200, description: 'Track deleted successfully' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async deleteTrack(@Param('id') id: string): Promise<{ message: string }> {
    await this.trackService.deleteTrack(id);
    return { message: `Track ${id} deleted successfully` };
  }
}
