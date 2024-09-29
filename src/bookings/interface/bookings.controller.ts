import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBookingUseCase } from '../application/use-cases/create-booking.use-case';
import { CancelBookingUseCase } from 'src/bookings/application/use-cases/cancel-booking.use-case';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
  ) {}
}
