import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@ObjectType()
@Entity()
export class Service {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  price: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.services, { eager: true })
  owner: User;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, booking => booking.service)
  bookings: Booking[];

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
