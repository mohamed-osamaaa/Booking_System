import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

@InputType()
export class ConfirmOrRejectBookingDto {
    @Field(() => ID)
    @IsNotEmpty()
    bookingId: number;

    @Field(() => BookingStatus)
    @IsEnum(BookingStatus)
    status: BookingStatus;
}
