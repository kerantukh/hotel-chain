import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  // Хеширует входные данные и возвращает хеш
  abstract hash(data: string | Buffer): Promise<string>;

  // Сравнивает входные данные с зашифрованным хешем и возвращает результат сравнения
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
