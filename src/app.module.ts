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
      type: process.env.TYPEORM_CONNECTION as 'postgres',

      // Хост базы данных
      host: process.env.TYPEORM_HOST,

      // Порт базы данных
      port: +process.env.TYPEORM_PORT,

      // Имя пользователя базы данных
      username: process.env.TYPEORM_USERNAME,

      // Пароль базы данных
      password: process.env.TYPEORM_PASSWORD,

      // Имя базы данных
      database: process.env.DATABASE,

      // Автоматическая загрузка сущностей
      autoLoadEntities: process.env.TYPEORM_AUTOLOAD_ENTITIES === 'true',

      // Синхронизация базы данных
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
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
