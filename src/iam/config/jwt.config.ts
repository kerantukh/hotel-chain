import { registerAs } from '@nestjs/config';

// Импортируем утилиту для регистрации конфигурации

// Функция registerAs позволяет регистрировать конфигурацию с указанным именем
// Первый аргумент - имя конфигурации
// Второй аргумент - функция, которая возвращает объект с настройками
export default registerAs('jwt', () => ({
  // secret - ключ для подписи и проверки токенов
  // В NestJS используется библиотека jsonwebtoken для работы с JWT
  // secret используется для создания и проверки подписи токена
  // ЗначениеSecret берется из переменной окружения JWT_SECRET
  secret: process.env.JWT_SECRET,

  // audience - аудитория для которой предназначен токен
  // В NestJS audience используется для проверки аудитории в токене
  // Значение audience берется из переменной окружения JWT_AUDIENCE
  audience: process.env.JWT_AUDIENCE,

  // issuer - издатель токена
  // В NestJS issuer используется для проверки издателя в токене
  // Значение issuer берется из переменной окружения JWT_ISSUER
  issuer: process.env.JWT_ISSUER,

  // accessTokenTtl - время жизни токена доступа
  // В NestJS accessTokenTtl используется для установки времени жизни токена доступа
  // Значение accessTokenTtl берется из переменной окружения JWT_ACCESS_TOKEN_TTL,
  // если переменная не задана, то используется значение по умолчанию 3600 (1 час)
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10),

  // refreshTokenTtl - время жизни токена обновления
  // В NestJS refreshTokenTtl используется для установки времени жизни токена обновления
  // Значение refreshTokenTtl берется из переменной окружения JWT_REFRESH_TOKEN_TTL,
  // если переменная не задана, то используется значение по умолчанию 86400 (1 день)
  refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400', 10),
}));
