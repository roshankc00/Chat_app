import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepositary } from '../common/database/abstract.repositary';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './entities/chat.entity';
import { ChatDocument } from './entities/chat.document';

@Injectable()
export class ChatsRepository extends AbstractRepositary<ChatDocument> {
  protected readonly logger = new Logger(ChatsRepository.name);
  constructor(@InjectModel(Chat.name) chatModel: Model<ChatDocument>) {
    super(chatModel);
  }
}
