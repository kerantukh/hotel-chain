import { PartialType } from '@nestjs/swagger';
import { CreateListingDto } from './create-listing.dto';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  id: number;
  name?: string;
  description?: string;
  location?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  costPerNight?: {
    amount: number;
    currency: string;
  };
  roomCount?: number;
  guestLimit?: number;
  features?: string[];
  availabilityPeriod?: {
    startDate: Date;
    endDate: Date;
  };
  isAvailable?: boolean;
}
