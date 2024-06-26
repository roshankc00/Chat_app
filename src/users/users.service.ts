import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repositary';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };

  async create(createUserInput: CreateUserInput) {
    const password = await this.hashPassword(createUserInput.password);
    return this.usersRepository.create({
      ...createUserInput,
      password,
    });
  }

  async findAll() {
    return this.usersRepository.find({ isActive: true });
  }

  findOne(_id: string) {
    return this.usersRepository.findOne({ _id, isActive: true });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password,
      );
    }

    return await this.usersRepository.findOneAndUpdate(
      { _id },
      {
        $set: updateUserInput,
      },
    );
  }

  remove(_id: string) {
    return this.usersRepository.findOneAndUpdate(
      {
        _id,
      },
      { $set: { isActive: false } },
    );
  }

  async validateUser(email: string, password: string) {
    const userExist: User = await this.usersRepository.findOne({
      email,
    });
    if (!userExist) {
      throw new NotFoundException();
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }
    return userExist;
  }
}
