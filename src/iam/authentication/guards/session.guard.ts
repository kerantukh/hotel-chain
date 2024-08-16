import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Гард для проверки авторизации пользователя
 * Проверяет, что пользователь прошел аутентификацию и авторизацию
 */
@Injectable()
export class SessionGuard implements CanActivate {
  /**
   * Метод, вызываемый NestJS при обработке запроса
   * @param context - контекст запроса
   * @returns Promise<boolean> - true, если пользователь прошел аутентификацию и авторизацию, иначе false
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Получаем объект запроса из контекста
    const request = context.switchToHttp().getRequest();

    // Проверяем, прошел ли пользователь аутентификацию
    return request.isAuthenticated();
  }
}
