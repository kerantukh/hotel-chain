import {
  IsOptional,
  IsNumber,
  IsArray,
  IsString,
  IsDate,
} from 'class-validator';

export class FilterListingsDto {
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  guestLimit?: number;

  @IsOptional()
  @IsNumber()
  roomCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDate()
  availableFrom?: Date;

  @IsOptional()
  @IsDate()
  availableTo?: Date;
}
