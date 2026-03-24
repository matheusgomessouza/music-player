import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TrackRepository } from '../repositories/track.repository';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { UpdateTrackDto } from '../dtos/update-track.dto';
import { TrackDto } from '../dtos/track.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TrackService {
  constructor(private trackRepository: TrackRepository) {}

  async uploadTrack(file: Express.Multer.File, createTrackDto: CreateTrackDto): Promise<TrackDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const track = await this.trackRepository.create({
      ...createTrackDto,
      filename: file.filename || file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    return plainToInstance(TrackDto, track, { excludeExtraneousValues: true });
  }

  async getAllTracks(take?: number, skip?: number): Promise<TrackDto[]> {
    const tracks = await this.trackRepository.findAll(take, skip);
    return plainToInstance(TrackDto, tracks, { excludeExtraneousValues: true });
  }

  async getTrackById(id: string): Promise<TrackDto> {
    const track = await this.trackRepository.findById(id);

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return plainToInstance(TrackDto, track, { excludeExtraneousValues: true });
  }

  async updateTrack(id: string, updateTrackDto: UpdateTrackDto): Promise<TrackDto> {
    const track = await this.trackRepository.findById(id);

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    const updatedTrack = await this.trackRepository.update(id, updateTrackDto);
    return plainToInstance(TrackDto, updatedTrack, { excludeExtraneousValues: true });
  }

  async deleteTrack(id: string): Promise<void> {
    const track = await this.trackRepository.findById(id);

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    await this.trackRepository.delete(id);
  }

  async getTrackFile(id: string): Promise<{ filename: string; mimeType: string }> {
    const track = await this.trackRepository.findById(id);

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return {
      filename: track.filename,
      mimeType: track.mimeType,
    };
  }
}
