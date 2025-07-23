import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingDto } from './dto/CreateBookingDto';
import { Injectable } from '@nestjs/common';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Service } from 'src/services/entities/service.entity';
import { BookingStatus } from './enums/booking-status.enum';
import { ConfirmOrRejectBookingDto } from './dto/ApproveOrRejectBookingDto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) { }

  async create(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const service = await this.serviceRepository.findOne({
      where: { id: createBookingDto.serviceId },
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

    return await this.bookingRepository.save(booking);
  }

  async confirmOrRejectBooking(
    dto: ConfirmOrRejectBookingDto,
    user: User,
  ): Promise<{ message: string }> {
    const booking = await this.bookingRepository.findOne({
      where: { id: +dto.bookingId },
      relations: ['service'],
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

    return { message: `Booking ${dto.status.toLowerCase()}` };
  }

}
