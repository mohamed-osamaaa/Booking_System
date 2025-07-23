import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private users = new Map<number, Socket>(); // userId -> socket

    constructor(private readonly messagesService: MessagesService) { }

    handleConnection(socket: Socket) {
        const userId = Number(socket.handshake.query.userId);
        if (userId) {
            this.users.set(userId, socket);
            console.log(`User ${userId} connected`);
        }
    }

    handleDisconnect(socket: Socket) {
        const userId = Number(socket.handshake.query.userId);
        this.users.delete(userId);
        console.log(`User ${userId} disconnected`);
    }

    @UseGuards(AuthenticationGuard)
    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: CreateMessageDto,
        @CurrentUser() currentUser: User,
    ) {
        const fromId = currentUser.id;

        const message = await this.messagesService.createMessage({
            toId: data.toId,
            content: data.content,
            fromId,
        });

        const toSocket = this.users.get(data.toId);
        if (toSocket) {
            toSocket.emit('receiveMessage', message);
        }

        const fromSocket = this.users.get(fromId);
        if (fromSocket && fromSocket.id !== toSocket?.id) {
            fromSocket.emit('receiveMessage', message);
        }
    }
}
