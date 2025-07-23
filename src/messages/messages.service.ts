import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SendMessageInterface } from './interfaces/SendMessageInterface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createMessage(dto: SendMessageInterface): Promise<Message> {
    const from = await this.userRepository.findOneBy({ id: +dto.fromId });
    const to = await this.userRepository.findOneBy({ id: +dto.toId });

    if (!from || !to) {
      throw new Error('User not found');
    }

    const message = this.messageRepository.create({
      content: dto.content,
      from: from,
      to: to,
    });

    return this.messageRepository.save(message);
  }

  async getMessages(userId1: number, userId2: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { from: { id: userId1 }, to: { id: userId2 } },
        { from: { id: userId2 }, to: { id: userId1 } },
      ],
      relations: ['from', 'to'],
      order: {
        id: 'ASC', // oldest to newest
      },
    });
  }
}
