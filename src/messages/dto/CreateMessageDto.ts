import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageDto {
  @Field(() => Int)
  toId: number;

  @Field()
  content: string;
}
