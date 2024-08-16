import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';

/**
 * Сервис для аутентификации пользователей по логину и паролю
 */
@Injectable()
export class SessionAuthenticationService {
  /**
   * Репозиторий для работы с сущностью User
   */
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    /**
     * Сервис для хеширования паролей
     */
    private readonly hashingService: HashingService,
  ) {}

  /**
   * Аутентификация пользователя
   * @param signInDto - данные для аутентификации
   * @throws UnauthorizedException - если пользователь не существует или пароль не совпадает
   */
  async signIn(signInDto: SignInDto) {
    // Поиск пользователя по логину
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не существует');
    }

    // Проверка совпадения пароля
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Пароль не совпадает');
    }

    return user;
  }
}
