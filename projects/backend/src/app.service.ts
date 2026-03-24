import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; timestamp: string } {
    return {
      message: 'Music Player API - Backend Service',
      timestamp: new Date().toISOString(),
    };
  }

  health(): { status: string } {
    return { status: 'ok' };
  }
}
