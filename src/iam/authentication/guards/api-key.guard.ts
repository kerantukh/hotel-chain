import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeysService } from '../api-keys.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity';
import { Repository } from 'typeorm';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

/**
 * Guard, который проверяет наличие валидного API-ключа в заголовке Authorization
 * и добавляет данные пользователя в запрос, если ключ валидный
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  /**
   * @param apiKeysService - сервис для работы с API-ключами
   * @param apiKeysRepository - репозиторий для работы с ApiKey
   */
  constructor(
    private readonly apiKeysService: ApiKeysService,
    @InjectRepository(ApiKey)
    private readonly apiKeysRepository: Repository<ApiKey>,
  ) {}

  /**
   * Метод, который вызывается NestJS при обработке запроса
   * @param context - контекст запроса
   * @returns Promise<boolean> - true, если запрос содержит валидный API-ключ
   * @throws UnauthorizedException - если запрос не содержит валидного API-ключа
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем объект запроса из контекста
    const request = context.switchToHttp().getRequest();

    // Извлекаем API-ключ из заголовка Authorization
    const apiKey = this.extractApiKeyFromHeader(request);

    // Если запрос не содержит API-ключа, выбрасываем исключение
    if (!apiKey) {
      throw new UnauthorizedException();
    }

    // Извлекаем идентификатор API-ключа
    const apiKeyEntityId = this.apiKeysService.extractIdFromApiKey(apiKey);

    try {
      // Пытаемся найти API-ключ в базе данных
      const apiKeyEntity = await this.apiKeysRepository.findOne({
        where: { uuid: apiKeyEntityId },
        relations: { user: true },
      });

      // Если API-ключа не существует, выбрасываем исключение
      if (!apiKeyEntity) {
        throw new UnauthorizedException();
      }

      // Пытаемся проверить API-ключ
      await this.apiKeysService.validate(apiKey, apiKeyEntity.key);

      // Если API-ключ валидный, добавляем данные пользователя в запрос
      request[REQUEST_USER_KEY] = {
        sub: apiKeyEntity.user.id,
        email: apiKeyEntity.user.email,
        role: apiKeyEntity.user.role,
      } as ActiveUserData;
    } catch {
      // Если API-ключ не валидный, выбрасываем исключение
      throw new UnauthorizedException();
    }

    // Если запрос успешно прошел проверку, возвращаем true
    return true;
  }

  /**
   * Метод, который извлекает API-ключ из заголовка Authorization
   * @param request - объект запроса
   * @returns string | undefined - API-ключ, если он существует, undefined - иначе
   */
  private extractApiKeyFromHeader(request: Request): string | undefined {
    const [type, key] = request.headers.authorization?.split(' ') ?? [];
    return type === 'ApiKey' ? key : undefined;
  }
}
