import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import { randomBytes, randomUUID } from 'crypto';

/**
 * Сервис для аутентификации пользователей
 */
@Injectable()
export class AuthenticationService {
  // Репозиторий для работы с сущностью User
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // Сервис для хеширования паролей
    private readonly hashingService: HashingService,

    // Сервис для работы с JWT
    private readonly jwtService: JwtService,

    // Конфигурация JWT
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    // Хранилище для хранения идентификаторов токенов обновления
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  /**
   * Регистрация нового пользователя
   * @param signUpDto - данные для регистрации
   */
  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('Пользователь уже существует');
      }
      throw err;
    }
  }

  /**
   * Аутентификация пользователя
   * @param signInDto - данные для аутентификации
   */
  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не существует');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Пароль не совпадает');
    }
    return await this.generateTokens(user);
  }

  /**
   * Генерация токенов доступа и обновления для пользователя
   * @param user - пользователь
   */
  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, role: user.role },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Обновление токенов доступа и обновления для пользователя
   * @param refreshToken - токен обновления
   */
  async refreshTokens(refreshToken: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshToken.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.usersRepository.findOneByOrFail({ id: sub });
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Токен обновления недействителен');
      }
      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        // Предупредить пользователя, что токен обновления мог быть украден?
        throw new UnauthorizedException('Доступ запрещен');
      }
      throw new UnauthorizedException();
    }
  }

  /**
   * Подписывает данные в JWT
   * @param userId - идентификатор пользователя
   * @param expiresIn - срок действия токена в секундах
   * @param payload - данные для подписи
   */
  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  /**
   * Выход пользователя
   * @param user - пользователь
   */
  async signOut(user: User) {
    // TODO: реализовать механизм выхода
    return true;
  }
}
