import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * Декоратор для извлечения данных о пользователе из запроса
 * @param field - поле, которое нужно извлечь
 * @param ctx - контекст выполнения
 * @returns значение поля или undefined, если поле не существует
 */
export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    // Получаем запрос
    const request = ctx.switchToHttp().getRequest();
    // Получаем данные о пользователе
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    // Если поле не указано, возвращаем все данные о пользователе
    return field ? user?.[field] : user;
  },
);
