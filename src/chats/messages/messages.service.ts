import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/createMessage.dto';
import { ChatsRepository } from 'src/chats/chats.repositary';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(private readonly chatRepository: ChatsRepository) {}
  async create({ content, chatId }: CreateMessageInput, userId: string) {
    const message: Message = {
      content,
      userId,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
        $or: [
          { userId },
          {
            userIds: {
              $in: [userId],
            },
          },
        ],
      },
      {
        $push: {
          messages: message,
        },
      },
    );
    console.log(message);
    return message;
  }
}
