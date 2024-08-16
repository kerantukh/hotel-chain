import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';
import { ApiKeyGuard } from './api-key.guard';
import { AccessTokenGuard } from './acces-token.guard';

/**
 * Класс Guard, который обрабатывает различные типы аутентификации
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  /**
   * По умолчанию используется AuthType.Bearer
   */
  private static readonly DEFAULT_AUTH_TYPE = AuthType.Bearer;

  /**
   * Соответствие каждого типа аутентификации соответствующему гарду
   */
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.ApiKey]: this.apiKeyGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  /**
   * Конструктор, который принимает инстансы гардов для различных типов аутентификации
   * @param reflector - инстанс Reflector для работы с метаданными
   * @param accessTokenGuard - инстанс AccessTokenGuard для проверки токена доступа
   * @param apiKeyGuard - инстанс ApiKeyGuard для проверки API-ключа
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {}

  /**
   * Метод, который вызывается NestJS при обработке запроса
   * @param context - контекст запроса
   * @returns Promise<boolean> - true, если запрос содержит валидный API-ключ или токен доступа
   * @throws UnauthorizedException - если запрос не содержит валидного API-ключа или токен доступа
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем типы аутентификации из метаданных
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.DEFAULT_AUTH_TYPE];

    // Создаем массив гардов из соответствующих типов аутентификации
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Создаем исключение UnauthorizedException
    let error = new UnauthorizedException();

    // Проверяем каждый гард на валидность
    for (const instance of guards) {
      try {
        const canActivate = await Promise.resolve(
          instance.canActivate(context),
        );

        // Если гард валиден, возвращаем true
        if (canActivate) {
          return true;
        }
      } catch (err) {
        // Если гард не валиден, выбрасываем исключение
        error = err;
      }
    }

    // Выбрасываем исключение, если все гарды не валидны
    throw error;
  }
}
