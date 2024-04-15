import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateChatInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;
}
