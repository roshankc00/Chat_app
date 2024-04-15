import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

@ObjectType()
export class Chat extends AbstractEntity {
  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  isPrivate: string;

  @Field({ nullable: true })
  @Prop()
  name?: string;

  @Field(() => [String])
  @Prop([String])
  userIds: string[];
}

export const chatSchema = SchemaFactory.createForClass(Chat);
