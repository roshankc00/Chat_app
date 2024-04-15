import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/createMessage.dto';
import { ChatsRepository } from 'src/chats/chats.repositary';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.dto';
import { PUB_SUB } from 'src/common/constants/injection-token';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED } from './constants/pubsub-trigger';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatRepository: ChatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}
  async create(
    { content, chatId }: CreateMessageInput,
    userId: string,
  ): Promise<Message> {
    const message: Message = {
      content,
      userId,
      chatId,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.userChatFilter(userId),
      },
      {
        $push: {
          messages: message,
        },
      },
    );
    await this.pubSub.publish(MESSAGE_CREATED, { messageCreated: message });
    return message;
  }

  async getMessages({ chatId }: GetMessagesArgs, userId: string) {
    return (
      await this.chatRepository.findOne({
        _id: chatId,
        ...this.userChatFilter(userId),
      })
    ).messages;
  }

  private userChatFilter(userId: string) {
    return {
      $or: [
        { userId },
        {
          userIds: {
            $in: [userId],
          },
        },
      ],
    };
  }
}