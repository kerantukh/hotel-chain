import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * Класс ошибки, указывающий на то, что токен обновления был недействителен
 *
 * Этот класс ошибки будет выброшен, если токен обновления, который был передан
 * в метод {@link validate}, не соответствует токену, который был сохранен
 * для пользователя в хранилище
 */
export class InvalidatedRefreshTokenError extends Error {}

/**
 * Класс хранилища с идентификаторами токенов обновления для пользователей
 *
 * Этот класс будет использоваться для хранения и проверки токенов обновления
 * для пользователей. Он будет работать с Redis, чтобы хранить данные.
 */
@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  /**
   * Клиент Redis
   *
   * @private
   */
  private redisClient: Redis;

  /**
   * Метод, который вызывается при запуске приложения
   *
   * @remarks
   * Этот метод будет вызван при запуске приложения. Он будет создавать
   * клиента Redis, который будет использоваться для хранения и проверки
   * токенов обновления.
   */
  onApplicationBootstrap() {
    // TODO: тут в дальнейшем нужно реализовать RedisModule
    this.redisClient = new Redis({ host: 'localhost', port: 6379 });
  }

  /**
   * Метод, который вызывается при завершении работы приложения
   *
   * @param signal - сигнал завершения
   *
   * @remarks
   * Этот метод будет вызван при завершении работы приложения. Он будет
   * закрывать клиента Redis, чтобы освободить ресурсы.
   */
  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  /**
   * Метод вставки идентификатора токена обновления для пользователя в хранилище
   *
   * @param userId - идентификатор пользователя
   * @param tokenId - идентификатор токена обновления
   *
   * @remarks
   * Этот метод будет вставлять новый токен обновления для пользователя
   * в хранилище. Он будет создавать новый ключ в хранилище Redis,
   * который будет содержать идентификатор токена обновления.
   */
  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  /**
   * Метод проверки идентификатора токена обновления для пользователя в хранилище
   *
   * @param userId - идентификатор пользователя
   * @param tokenId - идентификатор токена обновления
   *
   * @returns true, если идентификаторы совпадают, иначе false
   *
   * @throws InvalidatedRefreshTokenError - если идентификаторы не совпадают
   *
   * @remarks
   * Этот метод будет проверять, является ли токен обновления, который был
   * передан, токеном, который был сохранен для пользователя в хранилище.
   * Если токены не совпадают, он будет выбрасывать ошибку
   * {@link InvalidatedRefreshTokenError}.
   */
  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  /**
   * Метод удаления идентификатора токена обновления для пользователя из хранилища
   *
   * @param userId - идентификатор пользователя
   *
   * @remarks
   * Этот метод будет удалять идентификатор токена обновления для пользователя
   * из хранилища. Он будет удалять ключ в хранилище Redis,
   * который будет содержать идентификатор токена обновления.
   */
  async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  /**
   * Приватный метод, который формирует ключ для хранилища
   *
   * @param userId - идентификатор пользователя
   *
   * @returns ключ для хранилища
   *
   * @private
   *
   * @remarks
   * Этот метод будет формировать ключ для хранилища Redis, который будет
   * содержать идентификатор пользователя.
   */
  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
