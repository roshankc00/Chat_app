import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repositary';
import { PipelineStage, Types } from 'mongoose';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepositary: ChatsRepository) {}
  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepositary.create({
      ...createChatInput,
      userId,
      messages: [],
    });
  }

  async findMany(prePipeLineStages: PipelineStage[] = []) {
    const chats = await this.chatsRepositary.model.aggregate([
      ...prePipeLineStages,
      { $set: { latestMessage: { $arrayElemAt: ['$messages', -1] } } },
      { $unset: 'messages' },
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.userId',
          foreignField: '_id',
          as: 'latestMessage.user',
        },
      },
    ]);
    chats.forEach((chat) => {
      if (!chat.latestMessage?._id) {
        delete chat.latestMessage;
        return;
      }
      chat.latestMessage.user = chat.latestMessage.user[0];
      delete chat.latestMessage.userId;
      chat.latestMessage.chatId = chat._id;
    });
    return chats;
  }

  async findOne(_id: string): Promise<Chat> {
    const chats = await this.chatsRepositary.find([
      { $match: { chatId: new Types.ObjectId(_id) } },
    ]);
    if (!chats[0]) {
      throw new NotFoundException(`No chat was found with ID ${_id}`);
    }
    return chats[0];
  }
  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
