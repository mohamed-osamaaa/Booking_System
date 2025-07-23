import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';
import { MailModule } from 'src/utility/nodemailer/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Service]),
    MailModule,
  ],
  providers: [BookingResolver, BookingService],
})
export class BookingModule { }
