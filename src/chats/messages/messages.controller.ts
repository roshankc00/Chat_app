import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { ChatsService } from '../chats.service';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get('count')
  @UseGuards(JwtAuthGuard)
  async countChats(@Query('chartId') chatId: string) {
    return this.messagesService.countMessages(chatId);
  }
}
