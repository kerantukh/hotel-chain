import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Выполняется после инициализации модуля
   */
  onModuleInit() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  /**
   * Аутентификация пользователя по токену Google
   * @param token - токен Google
   * @returns токены доступа и обновления
   * @throws ConflictException - если пользователь уже существует
   * @throws UnauthorizedException - в случае ошибки аутентификации
   */
  async authenticate(token: string) {
    try {
      // Проверка идентификатора токена
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
      });
      const { email, sub: googleId } = loginTicket.getPayload();

      // Проверка существования пользователя
      let user = await this.userRepository.findOneBy({ googleId });
      if (!user) {
        // Создание нового пользователя
        user = await this.userRepository.save({ email, googleId });
      }

      // Генерация токенов доступа и обновления
      return this.authenticationService.generateTokens(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('Пользователь уже существует');
      }
      throw new UnauthorizedException();
    }
  }
}
