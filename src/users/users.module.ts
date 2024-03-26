import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './users.repositary';
import { DatabaseModule } from 'src/common/database/database.module';
import { User, UsersSchema } from './entities/users.entity';
@Module({
  imports: [
    DatabaseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  providers: [UsersResolver, UsersService, UsersRepository],
})
export class UsersModule {}
