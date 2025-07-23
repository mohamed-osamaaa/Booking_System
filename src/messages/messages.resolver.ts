import { Resolver, Query, Args } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

@Resolver(() => Message)
export class MessagesResolver {
    constructor(private readonly messagesService: MessagesService) { }

    @Query(() => [Message])
    async getChatMessages(
        @CurrentUser() currentUser: User,
        @Args('otherUserId') otherUserId: number,
    ): Promise<Message[]> {
        return this.messagesService.getMessages(currentUser.id, otherUserId);
    }
}
