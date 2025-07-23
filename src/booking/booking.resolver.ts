import { AuthorizeGuard } from './../utility/guards/authorization.guard';
import { AuthenticationGuard } from './../utility/guards/authentication.guard';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { CreateBookingDto } from './dto/CreateBookingDto';
import { ConfirmOrRejectBookingDto } from './dto/ApproveOrRejectBookingDto';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/utility/enums/user-roles.enum';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(
    private readonly bookingService: BookingService
  ) { }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.USER]))
  @Mutation(() => Booking)
  createBooking(
    @Args('createBooking') createBookingDto: CreateBookingDto,
    @CurrentUser() currentUser: User
  ) {
    return this.bookingService.create(createBookingDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.PROVIDER]))
  @Mutation(() => Booking)
  confirmOrRejectBooking(
    @Args('confirmOrRejectBooking') confirmOrRejectBooking: ConfirmOrRejectBookingDto,
    @CurrentUser() currentUser: User
  ) {
    return this.bookingService.confirmOrRejectBooking(confirmOrRejectBooking, currentUser);
  }

}
