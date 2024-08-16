import { PassportSerializer } from '@nestjs/passport';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { User } from 'src/users/entities/user.entity';

/**
 * Класс-serializer для преобразования данных пользователя в passport
 */
export class UserSerializer extends PassportSerializer {
  /**
   * Метод для преобразования данных пользователя в passport
   * @param user - данные пользователя
   * @param done - callback-функция для возврата результата
   */
  serializeUser(user: User, done: (err: Error, user: ActiveUserData) => void) {
    // Возвращаем объект с данными пользователя
    // sub - идентификатор пользователя
    // email - электронная почта пользователя
    // role - роль пользователя
    // permissions - права доступа пользователя
    done(null, {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });
  }

  /**
   * Метод для десериализации данных пользователя из passport
   * @param payload - объект с данными пользователя
   * @param done - callback-функция для возврата результата
   */
  async deserializeUser(
    payload: ActiveUserData,
    done: (err: Error, user: ActiveUserData) => void,
  ) {
    // Возвращаем объект с данными пользователя
    done(null, payload);
  }
}
