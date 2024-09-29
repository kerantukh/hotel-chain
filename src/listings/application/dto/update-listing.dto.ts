import { PartialType } from '@nestjs/swagger';
import { CreateListingDto } from './create-listing.dto';
import { Money } from 'src/listings/domain/value-objects/money.vo';
import { Address } from 'src/listings/domain/value-objects/address.vo';
import { DateRange } from 'src/listings/domain/value-objects/date-range.vo';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  id: number;
  name?: string;
  description?: string;
  location?: Address;
  costPerNight?: Money;
  roomCount?: number;
  guestLimit?: number;
  features?: string[];
  availabilityPeriod?: DateRange;
  isAvailable?: boolean;
}
