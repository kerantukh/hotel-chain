import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';

import { ApiKey } from '../api-keys/entities/api-key.entity';
import { Listing } from 'src/listings/domain/entities/listing.entity';
import { Booking } from 'src/bookings/domain/entities/booking.entity';

/**
 * Сущность "Пользователь"
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  // Идентификатор пользователя, автоматически генерируется
  id: number;

  @Column({ unique: true })
  // Электронная почта пользователя
  email: string;

  @Column({ nullable: true })
  // Пароль пользователя
  password: string;

  @Column({ enum: Role, default: Role.Regular })
  // Роль пользователя
  role: Role;

  @Column({ default: false })
  // Флаг включения двухфакторной аутентификации
  isTfaEnabled: boolean;

  @Column({ nullable: true })
  // Секретный ключ для двухфакторной аутентификации
  tfaSecret: string;

  @Column({ nullable: true })
  // Идентификатор Google-аккаунта
  googleId: string;

  @JoinTable()
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user, {
    cascade: true,
    nullable: true,
  })
  // Список API-ключей, привязанных к пользователю
  apiKeys: ApiKey[];

  @OneToMany(() => Booking, (booking) => booking.user, {
    cascade: true,
    nullable: true,
  })
  bookings: Booking[];

  @OneToMany(() => Listing, (listing) => listing.ownerId, {
    cascade: true,
    nullable: true,
  })
  listings: Listing[];
}
