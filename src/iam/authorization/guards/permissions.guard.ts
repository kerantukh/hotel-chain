import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { PermissionType } from '../permission.type';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';

/**
 * Guard, который проверяет, имеет ли пользователь права на выполнение запроса
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  /**
   * Конструктор, который принимает Reflector
   * @param reflector - Reflector, который помогает получать метаданные
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Метод, который вызывается NestJS при обработке запроса
   * @param context - контекст выполнения
   * @returns true, если пользователь имеет права на выполнение запроса, иначе false
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * Получаем права, которые определены для хендлера
     * и класса, к которому он относится
     */
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    /**
     * Если права не определены, то разрешаем доступ
     */
    if (!contextPermissions) {
      return true;
    }

    /**
     * Получаем данные о пользователе из запроса
     */
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    /**
     * Проверяем, имеет ли пользователь все права, которые определены
     * для хендлера
     */
    return contextPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
