import { ListingAggregate } from '../aggregates/listing.aggregate';
import { DateRange } from '../value-objects/date-range.vo';
import { Money } from '../value-objects/money.vo';

export class ListingDomainService {
  calculateTotalPrice(listing: ListingAggregate, dateRange: DateRange): Money {
    const nights = dateRange.getDurationInDays();
    const pricePerNight = listing.getCostPerNight();
    return new Money(
      pricePerNight.getAmount() * nights,
      pricePerNight.getCurrency(),
    );
  }

  // Здесь могут быть другие методы, которые работают с несколькими агрегатами
  // или выполняют сложные операции, не принадлежащие конкретному агрегату
}
