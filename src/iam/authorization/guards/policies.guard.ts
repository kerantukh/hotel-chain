import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
} from '@nestjs/common';

// Импортируем декоратор для работы с политиками
import { POLICIES_KEY } from '../decorators/policies.decorator';

// Импортируем константу для активации пользователя
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';

// Импортируем Reflector для работы с метаданными
import { Reflector } from '@nestjs/core';

// Импортируем интерфейс для политики
import { Policy } from '../policies/interfaces/policy.interface';

// Импортируем интерфейс для активации пользователя
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

// Импортируем хранилище хендлеров политик
import { PolicyHandlerStorage } from '../policies/policy-handlers.storage';

/**
 * Гард для проверки политик пользователя
 */
@Injectable()
export class PoliciesGuard implements CanActivate {
  /**
   * Конструктор класса PoliciesGuard
   * @param reflector - Reflector для работы с метаданными
   * @param policyHandlerStorage - хранилище хендлеров политик
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly policyHandlerStorage: PolicyHandlerStorage,
  ) {}

  /**
   * Метод для проверки политик пользователя
   * @param context - контекст выполнения
   * @returns Promise<boolean>
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем политики из метаданных
    const policies = this.reflector.getAllAndOverride<Policy[]>(POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если политики определены, проверяем их
    if (policies) {
      // Получаем данные о пользователе из контекста
      const user: ActiveUserData = context.switchToHttp().getRequest()[
        REQUEST_USER_KEY
      ];

      // Запускаем проверку всех политик
      await Promise.all(
        policies.map((policy) => {
          // Получаем хендлер для политики
          const policyHandler = this.policyHandlerStorage.get(
            policy.constructor as Type,
          );

          // Выполняем проверку политики
          return policyHandler.handle(policy, user);
        }),
      ).catch((err) => {
        // Если проверка не прошла, выбрасываем исключение
        throw new ForbiddenException(err.message);
      });
    }

    // Если все политики прошли или не определены, возвращаем true
    return true;
  }
}
