import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Track } from '@prisma/client';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { UpdateTrackDto } from '../dtos/update-track.dto';

@Injectable()
export class TrackRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateTrackDto & { filename: string; mimeType: string; size: number },
  ): Promise<Track> {
    return await this.prisma.track.create({
      data,
    });
  }

  async findAll(take?: number, skip?: number): Promise<Track[]> {
    return await this.prisma.track.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  }

  async findById(id: string): Promise<Track | null> {
    return await this.prisma.track.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTrackDto): Promise<Track> {
    return await this.prisma.track.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Track> {
    return await this.prisma.track.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return await this.prisma.track.count();
  }
}
