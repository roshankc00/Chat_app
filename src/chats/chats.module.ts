import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { Chat, chatSchema } from './entities/chat.entity';
import { ChatsRepository } from './chats.repositary';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: chatSchema }]),
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
})
export class ChatsModule {}
