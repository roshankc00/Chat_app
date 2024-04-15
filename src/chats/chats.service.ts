import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repositary';

@Injectable()
export class ChatsService {
  constructor(private readonly chartsRepositary: ChatsRepository) {}
  async create(createChatInput: CreateChatInput, userId: string) {
    const chart = await this.chartsRepositary.findOne({
      _id: '661cf600e193544531d1865e',
    });
    console.log(chart);
    return this.chartsRepositary.create({
      ...createChatInput,
      userId,
      userIds: createChatInput.userIds || [],
      messages: [],
    });
  }

  async findAll() {
    return this.chartsRepositary.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
