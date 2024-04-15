import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/createMessage.dto';
import { ChatsRepository } from 'src/chats/chats.repositary';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.dto';
import { PUB_SUB } from 'src/common/constants/injection-token';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED } from './constants/pubsub-trigger';
import { MessageCreatedArgs } from './dto/message-created.args';
import { MessageDocument } from './entities/message.document';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatRepository: ChatsRepository,
    private readonly userService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}
  async create(
    { content, chatId }: CreateMessageInput,
    userId: string,
  ): Promise<Message> {
    const messageDocument: MessageDocument = {
      content,
      userId: new Types.ObjectId(userId),
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          messages: messageDocument,
        },
      },
    );

    const message: Message = {
      ...messageDocument,
      chatId,
      user: await this.userService.findOne(userId),
    };
    return message;
  }

  async getMessages({ chatId, limit, skip }: GetMessagesArgs) {
    return this.chatRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$messages' },
      { $replaceRoot: { newRoot: '$messages' } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $unset: 'userId' },
      { $set: { chatId } },
    ]);
  }

  countMessages(chatId: string) {
    return this.chatRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$messages' },
      { $count: 'messages' },
    ])[0];
  }
  async messageCreated() {
    return this.pubSub.asyncIterator(MESSAGE_CREATED);
  }
}
