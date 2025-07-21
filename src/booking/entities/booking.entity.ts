import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Service } from 'src/services/entities/service.entity';
import { BookingStatus } from '../enums/booking-status.enum';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
});

@ObjectType()
@Entity()
export class Booking {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.bookings, { eager: true })
  user: User;

  @Field(() => Service)
  @ManyToOne(() => Service, service => service.bookings, { eager: true })
  service: Service;

  @Field({ nullable: true }) //timestamp type must be null or not null with defaul value in mysql 
  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Field(() => BookingStatus)
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
