import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepositary } from '../common/database/abstract.repositary';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsRepository extends AbstractRepositary<Chat> {
  protected readonly logger = new Logger(ChatsRepository.name);
  constructor(@InjectModel(Chat.name) chatModel: Model<Chat>) {
    super(chatModel);
  }
}
