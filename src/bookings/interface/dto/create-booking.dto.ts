import { IsDate, IsInt, Min, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsInt()
  @Min(1)
  guestCount: number;

  @IsString()
  roomType: string;
}
