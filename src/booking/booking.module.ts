import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Service]),
  ],
  providers: [BookingResolver, BookingService],
})
export class BookingModule { }
