import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// Импортируем декоратор для работы с ролями
import { ROLES_KEY } from '../decorators/roles.decorator';

// Импортируем перечисление ролей
import { Role } from 'src/users/enums/role.enum';

// Импортируем интерфейс для активации пользователя
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

// Импортируем константу для активации пользователя
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';

/**
 * Класс-гард для проверки ролей пользователя
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Конструктор класса
   * @param reflector - объект для работы с декораторами
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Метод для проверки ролей пользователя
   * @param context - контекст активации
   * @returns true, если пользователь имеет нужную роль, иначе false
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Получаем роли из контекста
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если роли не указаны, разрешаем доступ
    if (!contextRoles) {
      return true;
    }

    // Получаем пользователя из контекста
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    // Проверяем, имеет ли пользователь нужную роль
    return contextRoles.some((role) => user.role === role);
  }
}
