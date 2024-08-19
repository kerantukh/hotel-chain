import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Функция bootstrap - точка входа в приложение
 * Она создает экземпляр класса NestApplication,
 * настраивает его и запускает
 */
async function bootstrap() {
  // Создаем экземпляр класса NestApplication
  const app = await NestFactory.create(AppModule);

  // Устанавливаем глобальный префикс для API
  app.setGlobalPrefix('api');

  // Включаем глобальную валидацию
  app.useGlobalPipes(new ValidationPipe());

  // Разрешаем CORS
  app.enableCors();

  // Запускаем приложение
  await app.listen(3000);
}

// Вызываем функцию bootstrap
bootstrap();
