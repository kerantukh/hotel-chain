import { Address } from 'src/listings/domain/value-objects/address.vo';
import { DateRange } from 'src/listings/domain/value-objects/date-range.vo';
import { Money } from 'src/listings/domain/value-objects/money.vo';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @Type(() => Address)
  location: Address;

  @ValidateNested()
  @Type(() => Money)
  costPerNight: Money;

  @IsNumber()
  roomCount: number;

  @IsNumber()
  guestLimit: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ValidateNested()
  @Type(() => DateRange)
  availabilityPeriod: DateRange;
}
