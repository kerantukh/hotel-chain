import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

// Импортируем тип конфигурации JWT
import { ConfigType } from '@nestjs/config';

// Импортируем сервис для работы с JWT
import { JwtService } from '@nestjs/jwt';

// Импортируем объект Request из библиотеки Express
import { Request } from 'express';

// Импортируем конфигурацию JWT
import jwtConfig from 'src/iam/config/jwt.config';

// Импортируем константу, определяющую ключ для хранения пользовательских данных в запросе
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';

/**
 * Гард для проверки токена доступа
 * Обрабатывает запросы, добавляя данные пользователя в запрос
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  /**
   * Инстанс сервиса для работы с JWT
   */
  private readonly jwtService: JwtService;

  /**
   * Конфигурация JWT
   */
  private readonly jwtConfiguration: ConfigType<typeof jwtConfig>;

  /**
   * Конструктор класса
   * @param jwtService - инстанс сервиса для работы с JWT
   * @param jwtConfiguration - конфигурация JWT
   */
  constructor(
    @Inject(JwtService) jwtService: JwtService,
    @Inject(jwtConfig.KEY) jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    this.jwtService = jwtService;
    this.jwtConfiguration = jwtConfiguration;
  }

  /**
   * Метод, вызываемый NestJS при обработке запроса
   * @param context - контекст запроса
   * @returns Promise<boolean>
   * @throws UnauthorizedException - если запрос не содержит токена доступа
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем объект запроса из контекста
    const request = context.switchToHttp().getRequest();

    // Извлекаем токен доступа из заголовка Authorization
    const token = this.extractTokenFromHeader(request);

    // Если запрос не содержит токена доступа, выбрасываем исключение
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Пытаемся декодировать токен доступа
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );

      // Добавляем данные пользователя в запрос
      request[REQUEST_USER_KEY] = payload;
    } catch {
      // Если декодирование не удалось, выбрасываем исключение
      throw new UnauthorizedException();
    }

    // Запрос успешно прошел проверку, возвращаем true
    return true;
  }

  /**
   * Метод для извлечения токена доступа из заголовка Authorization
   * @param request - объект запроса
   * @returns string | undefined - токен доступа или undefined, если он не найден
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    // Получаем заголовок Authorization из запроса
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // Если заголовок содержит токен доступа и тип авторизации Bearer, возвращаем токен, иначе - undefined
    return type === 'Bearer' ? token : undefined;
  }
}
