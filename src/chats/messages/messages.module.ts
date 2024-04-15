import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';
import { PubSubModule } from 'src/common/pubsub/pubsub.module';
import { ChatsRepository } from '../chats.repositary';
import { MessagesController } from './messages.controller';

@Module({
  imports: [UsersModule, forwardRef(() => ChatsModule), PubSubModule],
  providers: [MessagesResolver, MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
