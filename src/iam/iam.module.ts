import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/acces-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { RolesGuard } from './authorization/guards/roles.guard';
import { PermissionGuard } from './authorization/guards/permissions.guard';
import { ApiKeysService } from './authentication/api-keys.service';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity';
import { ApiKeyGuard } from './authentication/guards/api-key.guard';
import { PolicyHandlerStorage } from './authorization/policies/policy-handlers.storage';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { FrameworkContributorPolicyHandler } from './authorization/policies/framework-contributor.policy';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { SessionAuthenticationService } from './authentication/session-authentication.service';
import { SessionAuthenticationController } from './authentication/session-authentication.controller';
import * as session from 'express-session';
import * as passport from 'passport';
import { UserSerializer } from './authentication/serializers/user-serializer';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';
import * as createRedisStore from 'connect-redis';
import { Redis } from 'ioredis';

/**
 * Модуль для аутентификации и авторизации.
 * Он импортирует TypeORM для работы с базой данных,
 * JWT для работы с токенами,
 * Config для работы с конфигурацией,
 * ApiKeysService для работы с API-ключами,
 * PolicyHandlerStorage для хранения обработчиков политик,
 * PoliciesGuard для проверки политик.
 * Он также импортирует несколько гвардов:
 * AuthenticationGuard для общей аутентификации,
 * AccessTokenGuard для аутентификации по токену доступа,
 * RolesGuard для проверки ролей,
 * PermissionGuard для проверки прав,
 * ApiKeyGuard для аутентификации по API-ключу,
 * PoliciesGuard для проверки политик.
 */
@Module({
  imports: [
    /**
     * Импортируем модуль TypeORM для работы с базой данных
     */
    TypeOrmModule.forFeature([User, ApiKey]),
    /**
     * Импортируем модуль JWT для работы с токенами
     */
    JwtModule.registerAsync(jwtConfig.asProvider()),
    /**
     * Импортируем модуль Config для работы с конфигурацией
     */
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    /**
     * Импортируем провайдер для хеширования паролей
     */
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    /**
     * Импортируем провайдер гварда аутентификации
     */
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    /**
     * Импортируем провайдер гварда политик
     */
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    /**
     * Импортируем провайдер гварда ролей
     */
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    /**
     * Импортируем провайдер гварда прав
     */
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },

    AccessTokenGuard,
    ApiKeyGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
    ApiKeysService,
    PolicyHandlerStorage,
    FrameworkContributorPolicyHandler,
    GoogleAuthenticationService,
    SessionAuthenticationService,
    UserSerializer,
    OtpAuthenticationService,
  ],
  controllers: [
    AuthenticationController,
    GoogleAuthenticationController,
    SessionAuthenticationController,
  ],
})
export class IamModule implements NestModule {
  /**
   * Метод для конфигурации middleware
   * Задача этого метода - настройка middleware, которые будут применяться ко всем маршрутам приложения
   * @param consumer - объект, через который мы можем настроить применение middleware
   */
  configure(consumer: MiddlewareConsumer) {
    /**
     * Настраиваем применение middleware session
     * session - middleware, который отвечает за сохранение данных пользователя в сессиях
     * session позволяет сохранять данные между запросами, например, сохранять данные пользователя после авторизации
     * @param session - объект с настройками сессии
     * @param session.secret - секретный ключ, который используется для шифрования данных сессии
     * @param session.resave - флаг, определяющий нужно ли сохранять сессию, даже если ничего не изменилось
     * @param session.saveUninitialized - флаг, определяющий нужно ли сохранять сессию, если она не была инициализирована
     * @param session.cookie - объект с настройками куки
     * @param session.cookie.sameSite - флаг, определяющий нужно ли установить флаг SameSite для куки
     * @param session.cookie.httpOnly - флаг, определяющий нужно ли установить флаг HttpOnly для куки
     */
    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
            sameSite: true,
            httpOnly: true,
          },
        }),
        /**
         * Настраиваем применение middleware passport.initialize
         * passport.initialize - middleware, который инициализирует passport и добавит его в контекст запроса
         * passport.initialize позволяет использовать различные стратегии аутентификации (passport strategies)
         */
        passport.initialize(),
        /**
         * Настраиваем применение middleware passport.session
         * passport.session - middleware, который сохранит данные пользователя в сессиих
         * passport.session использует middleware session и сохраняет данные пользователя в сессиих
         */
        passport.session(),
      )
      /**
       * Указываем маршруты, на которые будут применяться настроенные middleware
       * В данном случае на все маршруты приложения
       */
      .forRoutes('*');
  }
}
