import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateBookingDto } from './dto/CreateBookingDto';
import { ConfirmOrRejectBookingDto } from './dto/ApproveOrRejectBookingDto';
import { Booking } from './entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import { BookingStatus } from './enums/booking-status.enum';
import { MailService } from 'src/utility/nodemailer/mail.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly mailService: MailService,
  ) { }

  async create(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const service = await this.serviceRepository.findOne({
      where: { id: createBookingDto.serviceId },
      relations: ['owner'],
    });

    if (!service) {
      throw new Error('Service not found');
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      status: BookingStatus.PENDING,
      user,
      service,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Send email to provider (service owner) with Confirm/Reject buttons
    await this.mailService.sendTemplateEmail(
      service.owner.email,
      'New Booking Request',
      'booking-request',
      {
        ownerName: service.owner.name,
        userName: user.name,
        serviceTitle: service.title,
        startDate: createBookingDto.startDate,
        endDate: createBookingDto.endDate,
        confirmUrl: `http://front-end/bookings/${savedBooking.id}/confirm`,
        rejectUrl: `http://front-end/bookings/${savedBooking.id}/reject`,
      }
    );

    return savedBooking;
  }

  async confirmOrRejectBooking(
    dto: ConfirmOrRejectBookingDto,
    user: User,
  ): Promise<{ message: string }> {
    const booking = await this.bookingRepository.findOne({
      where: { id: +dto.bookingId },
      relations: ['service', 'service.owner', 'user'],
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.service.owner.id !== user.id) {
      throw new Error('You are not authorized to decide on this booking');
    }

    if (![BookingStatus.CONFIRMED, BookingStatus.REJECTED].includes(dto.status)) {
      throw new Error('Invalid status value');
    }

    booking.status = dto.status;
    await this.bookingRepository.save(booking);

    // Send email to user who booked the service
    await this.mailService.sendTemplateEmail(
      booking.user.email,
      `Booking ${dto.status}`,
      'booking-status',
      {
        userName: booking.user.name,
        serviceTitle: booking.service.title,
        status: dto.status,
        ownerName: booking.service.owner.name,
      }
    );

    return { message: `Booking ${dto.status.toLowerCase()}` };
  }
}
