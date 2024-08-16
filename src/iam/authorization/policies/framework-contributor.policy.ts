import { Injectable } from '@nestjs/common';

import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { PolicyHandler } from './interfaces/policy-handler.interface';
import { Policy } from './interfaces/policy.interface';
import { PolicyHandlerStorage } from './policy-handlers.storage';

/**
 * Класс, описывающий политику "FrameworkContributor".
 * Пользователь является "контрибьютором фреймворка",
 * если его email заканчивается на "@mail.com".
 */
export class FrameworkContributorPolicy implements Policy {
  name = 'FrameworkContributor';
}

/**
 * Хендлер для политики "FrameworkContributor".
 * Проверяет, что пользователь является "контрибьютором фреймворка".
 */
@Injectable()
export class FrameworkContributorPolicyHandler
  implements PolicyHandler<FrameworkContributorPolicy>
{
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(FrameworkContributorPolicy, this);
  }

  /**
   * Проверяет, что пользователь является "контрибьютором фреймворка".
   * @param policy - политика, которую нужно проверить
   * @param user - данные о пользователе
   * @throws Error - если пользователь не является "контрибьютором фреймворка"
   */
  async handle(
    policy: FrameworkContributorPolicy,
    user: ActiveUserData,
  ): Promise<void> {
    const isContributor = user.email.endsWith('@mail.com');
    if (!isContributor) {
      throw new Error('User is not a contributor');
    }
  }
}
