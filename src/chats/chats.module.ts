import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { Chat } from './entities/chat.entity';
import { ChatsRepository } from './chats.repositary';
import { MessagesModule } from './messages/messages.module';
import { ChatSchema } from './entities/chat.document';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => MessagesModule),
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository],
})
export class ChatsModule {}
