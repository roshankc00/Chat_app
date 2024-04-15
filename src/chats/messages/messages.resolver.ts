import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql.authguard';
import { CreateMessageInput } from './dto/createMessage.dto';
import { CurrentUser } from 'src/auth/decorators/currentuser.decorator';
import { TokenPayload } from 'src/auth/auth.service';
import { GetMessagesArgs } from './dto/get-messages.dto';
import { PUB_SUB } from 'src/common/constants/injection-token';
import { PubSub } from 'graphql-subscriptions';
import { MessageCreatedArgs } from './dto/message-created.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageDto: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ): Promise<Message> {
    return this.messagesService.create(createMessageDto, user.userId);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessageArgs: GetMessagesArgs,
    @CurrentUser() user: TokenPayload,
  ): Promise<Message[]> {
    return this.messagesService.getMessages(getMessageArgs);
  }

  @Subscription(() => Message, {
    filter: (payload, variables: MessageCreatedArgs, context) => {
      const userId = context.req.user.userId;
      const message: Message = payload.messageCreated;
      return (
        variables.chatIds.includes(message.chatId) &&
        userId !== message.user._id.toHexString()
      );
    },
    //
  })
  messageCreated(@Args() messageCreatedArgs: MessageCreatedArgs) {
    return this.messagesService.messageCreated();
  }
}
