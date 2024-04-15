import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql.authguard';
import { CurrentUser } from 'src/auth/decorators/currentuser.decorator';
import { TokenPayload } from 'src/auth/auth.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('_id') _id: string) {
    return this.usersService.findOne(_id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @Args('updateUerInput') updateUserInput: UpdateUserInput,
    @CurrentUser() paylaod: TokenPayload,
  ) {
    return this.usersService.update(paylaod.userId, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  removeUser(@CurrentUser() paylaod: TokenPayload) {
    return this.usersService.remove(paylaod.userId);
  }

  @Query(() => User, { name: 'currentUser' })
  @UseGuards(GqlAuthGuard)
  getCurrentUser(@CurrentUser() payload: TokenPayload) {
    return this.usersService.findOne(payload.userId);
  }
}
