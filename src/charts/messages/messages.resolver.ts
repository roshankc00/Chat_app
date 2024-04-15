import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql.authguard';
import { CreateMessageInput } from './dto/createMessage.dto';
import { CurrentUser } from 'src/auth/decorators/currentuser.decorator';
import { TokenPayload } from 'src/auth/auth.service';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageDto: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.create(createMessageDto, user.userId);
  }
}
