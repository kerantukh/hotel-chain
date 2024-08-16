import { Body, Controller, Post } from '@nestjs/common';

import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleTokenDto } from '../dto/google-token.dto';

/**
 * Контроллер для аутентификации с помощью Google
 */
@Auth(AuthType.None)
@Controller('authentication/google')
export class GoogleAuthenticationController {
  /**
   * Конструктор контроллера
   * @param googleAuthService - сервис аутентификации с помощью Google
   */
  constructor(
    private readonly googleAuthService: GoogleAuthenticationService,
  ) {}

  /**
   * Метод для аутентификации с помощью токена Google
   * @param tokenDto - DTO, содержащее токен Google
   * @returns Promise, возвращающий токены доступа и обновления
   */
  @Post()
  async authenticate(@Body() tokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(tokenDto.token);
  }
}
