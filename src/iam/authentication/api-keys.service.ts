import { Injectable } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service'; // Импортируем сервис для хеширования
import { randomUUID } from 'crypto'; // Импортируем функцию для генерации UUID

/**
 * Интерфейс, описывающий созданный API-ключ и его хеш
 */
export interface GeneratedApiKeyPayload {
  apiKey: string; // API-ключ
  hashedKey: string; // Хеш API-ключа
}

/**
 * Сервис для работы с API-ключами
 */
@Injectable()
export class ApiKeysService {
  /**
   * Конструктор класса, принимает сервис для хеширования
   * @param hashingService - Сервис для хеширования
   */
  constructor(private readonly hashingService: HashingService) {}

  /**
   * Метод для создания API-ключа и его хеша
   * @param id - Идентификатор пользователя
   * @returns Объект с API-ключом и его хешем
   */
  async createAndHash(id: number): Promise<GeneratedApiKeyPayload> {
    const apiKey = this.generateApiKey(id); // Создаем API-ключ
    const hashedKey = await this.hashingService.hash(apiKey); // Хешируем API-ключ
    return { apiKey, hashedKey }; // Возвращаем объект с API-ключом и его хешем
  }

  /**
   * Метод для проверки API-ключа и его хеша
   * @param apiKey - API-ключ
   * @param hashedKey - Хеш API-ключа
   * @returns Результат проверки
   */
  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    return this.hashingService.compare(apiKey, hashedKey); // Вызываем метод сравнения сервиса для хеширования
  }

  /**
   * Метод для извлечения идентификатора пользователя из API-ключа
   * @param apiKey - API-ключ
   * @returns Идентификатор пользователя
   */
  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' '); // Извлекаем идентификатор пользователя из API-ключа
    return id; // Возвращаем идентификатор пользователя
  }

  /**
   * Приватный метод для генерации API-ключа
   * @param id - Идентификатор пользователя
   * @returns Сгенерированный API-ключ
   */
  private generateApiKey(id: number): string {
    const apiKey = `${id} ${randomUUID()}`; // Формируем API-ключ
    return Buffer.from(apiKey).toString('base64'); // Преобразуем в base64 и возвращаем
  }
}
