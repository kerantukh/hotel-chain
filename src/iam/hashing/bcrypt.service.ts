import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { genSalt, hash, compare } from 'bcrypt';

// Сервис для использования алгоритма bcrypt для хеширования паролей.

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    // Генерируем соль
    const salt = await genSalt();
    // Хешируем данные с использованием соль
    return hash(data, salt);
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    // Сравниваем данные с зашифрованным хешем
    return compare(data, encrypted);
  }
}
