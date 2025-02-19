import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from '../decorators/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';
import { APIKeyGuard } from './api-key.guard';
import { Auth_Types, ConditionGuard } from '../constants/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate> = {
    [Auth_Types.Bearer]: this.accessTokenGuard,
    [Auth_Types.APIKey]: this.apiKeyGuard,
    [Auth_Types.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //1. check giá trị trong Auth decorator, nếu không dùng decorator thì gán giá trị mặc định
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [Auth_Types.None], options: { condition: ConditionGuard.And } };

    //2. Map các giá trị trong authTypes thành các guard tương ứng
    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType]);

    let error = new UnauthorizedException();

    //3. Nếu condition là OR thì chỉ cần 1 guard trả về true thì sẽ cho phép truy cập
    //Nếu condition là AND thì tất cả guard đều trả về true thì mới cho phép truy cập
    if (authTypeValue.options.condition === ConditionGuard.Or) {
      for (const guard of guards) {
        const canActive = await Promise.resolve(guard.canActivate(context)).catch((err) => {
          error = err;
          return false;
        });

        if (canActive) {
          return true;
        }
      }

      throw error;
    } else {
      for (const guard of guards) {
        const canActive = await Promise.resolve(guard.canActivate(context)).catch((err) => {
          error = err;
          return false;
        });

        if (!canActive) {
          throw new UnauthorizedException();
        }
      }

      return true;
    }
  }
}
