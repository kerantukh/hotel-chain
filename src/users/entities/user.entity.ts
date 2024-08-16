import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import {
  Permission,
  PermissionType,
} from 'src/iam/authorization/permission.type';
import { ApiKey } from '../api-keys/entities/api-key.entity';

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
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
  // Список API-ключей, привязанных к пользователю
  apiKeys: ApiKey[];

  /*
   NOTE: Having the "permissions" column in combination with the "role"
    likely does not make sense.
  */
  @Column({ enum: Permission, default: [], type: 'json' })
  // Список разрешений, привязанных к пользователю
  permissions: PermissionType[];
}
