import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';

/**
 * Главный модуль приложения
 */
@Module({
  imports: [
    // Модуль конфигурации
    ConfigModule.forRoot(),

    // Модуль пользователей
    UsersModule,

    // Модуль TypeORM
    TypeOrmModule.forRoot({
      // Тип базы данных
      type: 'postgres',

      // Хост базы данных
      host: 'localhost',

      // Порт базы данных
      port: 5432,

      // Имя пользователя базы данных
      username: 'postgres',

      // Пароль базы данных
      password: 'pass123',

      // Имя базы данных
      database: 'postgres',

      // Автоматическая загрузка сущностей
      autoLoadEntities: true,

      // Синхронизация базы данных
      synchronize: true,
    }),

    // Модуль аутентификации и авторизации
    IamModule,

    // Модуль продуктов
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
