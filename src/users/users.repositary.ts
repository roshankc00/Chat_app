import { Inject, Injectable, Logger } from '@nestjs/common';
import { AbstractRepositary } from '../common/database/abstract.repositary';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/users.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepositary<User> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(@InjectModel(User.name) usersModel: Model<User>) {
    super(usersModel);
  }
}
