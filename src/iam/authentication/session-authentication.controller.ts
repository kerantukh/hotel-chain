import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Auth } from './decorators/auth.decorator'; // Декоратор для аутентификации
import { AuthType } from './enums/auth-type.enum'; // Перечисление типов аутентификации
import { SessionAuthenticationService } from './session-authentication.service'; // Сервис для сессионной аутентификации
import { promisify } from 'util'; // Утилита для работы с асинхронными функциями
import { SignInDto } from './dto/sign-in.dto'; // DTO для входа в систему
import { Request } from 'express'; // Объект запроса Express
import { SessionGuard } from './guards/session.guard'; // Гард для проверки сессии
import { ActiveUser } from '../decorators/active-user.decorator'; // Декоратор для активации пользователя
import { ActiveUserData } from '../interfaces/active-user-data.interface'; // Интерфейс для активации пользователя

@Auth(AuthType.None) // Устанавливаем дефолтную аутентификацию в None
@Controller('session-authentication') // Устанавливаем префикс маршрутов
export class SessionAuthenticationController {
  constructor(
    private readonly sessionAuthService: SessionAuthenticationService, // Инжектим сервис сессионной аутентификации
  ) {}

  /**
   * Метод для входа в систему
   * @param request - объект запроса Express
   * @param signInDto - DTO для входа в систему
   */
  @HttpCode(HttpStatus.OK) // Устанавливаем код статуса в OK
  @Post('sign-in') // Устанавливаем маршрут для входа в систему
  async signIn(@Req() request: Request, @Body() signInDto: SignInDto) {
    const user = await this.sessionAuthService.signIn(signInDto); // Аутентифицируем пользователя
    await promisify(request.logIn).call(request, user); // Активируем сессию
  }

  /**
   * Метод для приветствия активированного пользователя
   * @param user - данные активированного пользователя
   */
  @UseGuards(SessionGuard) // Используем гард для проверки сессии
  @Get() // Устанавливаем маршрут для приветствия
  async sayHello(@ActiveUser() user: ActiveUserData) {
    return `Hello ${user.email}!`; // Возвращаем приветствие
  }
}
