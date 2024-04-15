import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chartService: ChatsService) {}
  @Get('count')
  @UseGuards(JwtAuthGuard)
  async countChats() {
    return this.chartService.countChart();
  }
}
