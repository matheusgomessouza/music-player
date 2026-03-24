import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHello(): { message: string; timestamp: string } {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Service health status' })
  health(): { status: string } {
    return this.appService.health();
  }
}
