import { Injectable, Type } from '@nestjs/common';
import { PolicyHandler } from './interfaces/policy-handler.interface';
import { Policy } from './interfaces/policy.interface';

/**
 * Хранилище хендлеров политик.
 * Хранит ассоциацию между политиками и их хендлерами.
 */
@Injectable()
export class PolicyHandlerStorage {
  /**
   * Коллекция, где ключ - класс политики, а значение - хендлер для этой политики.
   */
  private readonly collection = new Map<Type<Policy>, PolicyHandler<any>>();

  /**
   * Добавляет в хранилище новую ассоциацию между политикой и хендлером.
   * @param policyCls - класс политики
   * @param handler - хендлер для этой политики
   */
  add<T extends Policy>(policyCls: Type<T>, handler: PolicyHandler<T>) {
    this.collection.set(policyCls, handler);
  }

  /**
   * Возвращает хендлер для указанной политики.
   * Если хендлер отсутствует, выбрасывает ошибку.
   * @param policyCls - класс политики
   * @returns хендлер для этой политики
   * @throws Error - если хендлер отсутствует
   */
  get<T extends Policy>(policyCls: Type<T>): PolicyHandler<T> | undefined {
    const handler = this.collection.get(policyCls);
    if (!handler) {
      throw new Error(
        `"${policyCls.name}" does not have the associated handler`,
      );
    }
    return handler;
  }
}
