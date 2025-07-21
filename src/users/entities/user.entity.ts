import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Service } from 'src/services/entities/service.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Message } from 'src/messages/entities/message.entity';
import { UserRole } from '../enums/user-roles.enum';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // NOT exposed in GraphQL

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Field(() => [Service], { nullable: true })
  @OneToMany(() => Service, service => service.owner)
  services: Service[];

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, booking => booking.user)
  bookings: Booking[];

  @OneToMany(() => Message, message => message.from)
  sentMessages: Message[];

  @OneToMany(() => Message, message => message.to)
  receivedMessages: Message[];

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
