import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class LoginResponse {
    @Field()
    accessToken: string;

    @Field(() => User)
    user: User;
}