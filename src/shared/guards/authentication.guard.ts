import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from '../decorators/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';
import { Auth_Types, ConditionGuard } from '../constants/auth.constant';
import { PaymentAPIKeyGuard } from './payment-api-key.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly paymentApiKeyGuard: PaymentAPIKeyGuard,
  ) {
    this.authTypeGuardMap = {
      [Auth_Types.Bearer]: this.accessTokenGuard,
      [Auth_Types.PaymentAPIKey]: this.paymentApiKeyGuard,
      [Auth_Types.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //1. check giá trị trong Auth decorator, nếu không dùng decorator thì gán giá trị mặc định
    const authTypeValue = this.getAuthTypeValue(context);

    //2. Map các giá trị trong authTypes thành các guard tương ứng
    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType]);

    return authTypeValue.options.condition === ConditionGuard.And
      ? this.handleAndCondition(guards, context)
      : this.handleOrCondition(guards, context);
  }

  private getAuthTypeValue(context: ExecutionContext): AuthTypeDecoratorPayload {
    return (
      this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? { authTypes: [Auth_Types.Bearer], options: { condition: ConditionGuard.And } }
    );
  }

  private async handleOrCondition(guards: CanActivate[], context: ExecutionContext) {
    let lastError: any = null;

    //Duyệt qua hết các guard nếu có 1 guard pass thì return true
    for (const guard of guards) {
      try {
        if (await guard.canActivate(context)) {
          return true;
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError instanceof HttpException) {
      throw lastError;
    }

    throw new UnauthorizedException();
  }

  private async handleAndCondition(guards: CanActivate[], context: ExecutionContext) {
    //Duyệt qua hết các guard nếu mọi guard đều pass thì return true
    for (const guard of guards) {
      try {
        if (!(await guard.canActivate(context))) {
          throw new UnauthorizedException();
        }
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }

        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
