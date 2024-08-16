/**
 * Интерфейс хендлера политик.
 * Хендлер - это объект, который отвечает за проверку политики у пользователя.
 */

import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

// Импортируем интерфейс политики
import { Policy } from './policy.interface';

/**
 * Интерфейс хендлера политик.
 * Хендлер - это объект, который отвечает за проверку политики у пользователя.
 */
export interface PolicyHandler<T extends Policy> {
  /**
   * Метод, который проверяет политику у пользователя.
   * @param policy - политика, которую нужно проверить
   * @param user - данные о пользователе
   * @throws Error - если пользователь не удовлетворяет политике
   */
  handle(policy: T, user: ActiveUserData): Promise<void>;
}
