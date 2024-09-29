import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';
import { ListingOrmEntity } from 'src/listings/infrastructure/listing.orm-entity';
import { User } from 'src/users/entities/user.entity';
import { Listing } from 'src/listings/domain/entities/listing.entity';

export class ListingRepositoryImpl implements ListingRepository {
  private listings: ListingOrmEntity[] = [];

  private toOrmEntity(listing: Listing): ListingOrmEntity {
    const ormEntity = new ListingOrmEntity();
    ormEntity.id = listing.id;
    ormEntity.name = listing.name;
    ormEntity.description = listing.description;
    ormEntity.location = listing.location;
    ormEntity.costPerNight = listing.costPerNight;
    ormEntity.roomCount = listing.roomCount;
    ormEntity.guestLimit = listing.guestLimit;
    ormEntity.score = listing.score;
    ormEntity.isAvailable = listing.isAvailable;
    ormEntity.features = listing.features;
    ormEntity.availabilityPeriod = listing.availabilityPeriod;
    ormEntity.createdDate = listing.createdDate;
    ormEntity.modifiedDate = listing.modifiedDate;
    ormEntity.isDeleted = listing.isDeleted;
    ormEntity.currency = listing.currency;
    ormEntity.coordinates = listing.coordinates;
    ormEntity.images = listing.images;
    ormEntity.user = new User(); // Создаем новый объект User
    ormEntity.user.id = listing.ownerId; // Присваиваем ID владельца
    return ormEntity;
  }

  private toDomainEntity(ormEntity: ListingOrmEntity): Listing {
    const listing = new Listing();
    listing.id = ormEntity.id;
    listing.name = ormEntity.name;
    listing.description = ormEntity.description;
    listing.location = ormEntity.location;
    listing.costPerNight = ormEntity.costPerNight;
    listing.roomCount = ormEntity.roomCount;
    listing.guestLimit = ormEntity.guestLimit;
    listing.score = ormEntity.score;
    listing.isAvailable = ormEntity.isAvailable;
    listing.features = ormEntity.features;
    listing.availabilityPeriod = ormEntity.availabilityPeriod;
    listing.createdDate = ormEntity.createdDate;
    listing.modifiedDate = ormEntity.modifiedDate;
    listing.isDeleted = ormEntity.isDeleted;
    listing.currency = ormEntity.currency;
    listing.coordinates = ormEntity.coordinates;
    listing.images = ormEntity.images;
    listing.ownerId = ormEntity.user.id; // Присваиваем ID владельца из ORM сущности
    return listing;
  }

  async findAll(): Promise<ListingOrmEntity[]> {
    return this.listings; // Возвращает все объявления
  }

  async findById(id: number): Promise<ListingOrmEntity | null> {
    return this.listings.find((listing) => listing.id === id) || null; // Находит объявление по ID
  }

  async findByUser(user: User): Promise<ListingOrmEntity[]> {
    return this.listings.filter((listing) => listing.user.id === user.id); // Находит объявления по пользователю
  }

  async findByUserId(userId: number): Promise<ListingOrmEntity[]> {
    return this.listings.filter((listing) => listing.user.id === userId); // Находит объявления по ID пользователя
  }

  async save(listing: Listing): Promise<Listing> {
    const ormEntity = this.toOrmEntity(listing);
    this.listings.push(ormEntity); // Сохраняет новое объявление
    return this.toDomainEntity(ormEntity);
  }

  async update(listing: Listing): Promise<Listing> {
    const index = this.listings.findIndex((l) => l.id === listing.id); // Находит индекс объявления для обновления
    if (index === -1) {
      throw new Error('Listing not found'); // Ошибка, если объявление не найдено
    }
    const ormEntity = this.toOrmEntity(listing);
    this.listings[index] = ormEntity; // Обновляет объявление
    return this.toDomainEntity(ormEntity);
  }

  async delete(id: number): Promise<void> {
    this.listings = this.listings.filter((listing) => listing.id !== id); // Удаляет объявление по ID
  }
}
