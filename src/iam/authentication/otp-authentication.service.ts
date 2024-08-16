import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

/**
 * Сервис для работы с аутентификацией по одноразовому паролю
 */
@Injectable()
export class OtpAuthenticationService {
  /**
   * Конструктор сервиса
   * @param configService - сервис для работы с конфигурацией
   * @param userRepository - репозиторий для работы с сущностью User
   */
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Генерирует секретный ключ для аутентификации по одноразовому паролю
   * @param email - электронная почта пользователя
   * @returns uri и секретный ключ
   */
  async generateSecret(email: string) {
    const secret = authenticator.generateSecret();
    const appName = this.configService.getOrThrow('TFA_APP_NAME');
    const uri = authenticator.keyuri(email, appName, secret);
    return {
      uri,
      secret,
    };
  }

  /**
   * Проверяет введенный одноразовый пароль
   * @param code - введенный одноразовый пароль
   * @param secret - секретный ключ пользователя
   * @returns результат проверки
   */
  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  async enableTfaForUser(email: string, secret: string) {
    const { id } = await this.userRepository.findOneOrFail({
      where: { email },
      select: { id: true },
    });
    await this.userRepository.update(
      { id },
      // На заметку: Идеально было бы зашифровать "2fa secret", а не хранить его в открытом виде.
      // Однако, мы не можем использовать хеширование, так как исходный секрет необходим для
      // проверки кода, предоставленного пользователем.
      { tfaSecret: secret, isTfaEnabled: true },
    );
  }
}
