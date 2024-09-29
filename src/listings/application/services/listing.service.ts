import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../../domain/entities/listing.entity';
import { User } from 'src/users/domain/entities/user.entity';
import { CreateListingDto } from '../../application/dto/create-listing.dto'; // Убедитесь в корректности пути

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createListing(
    userId: number,
    listingData: CreateListingDto,
  ): Promise<Listing> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const listing = this.listingRepository.create({
      ...listingData,
      userId: user.id,
    });

    return this.listingRepository.save(listing);
  }

  async removeListing(listingId: number): Promise<void> {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId, isDeleted: false },
    });
    if (!listing) {
      throw new Error('Объявление не найдено');
    }

    listing.removeListing(); // Используем метод агрегатного корня для изменения состояния
    await this.listingRepository.save(listing);
  }

  // Другие методы для управления связями и логикой
}
