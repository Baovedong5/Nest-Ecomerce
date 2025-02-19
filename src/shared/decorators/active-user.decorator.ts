import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenPayload } from '../types/jwt.type';
import { REQUEST_USER_KEY } from '../constants/auth.constant';

export const ActiveUser = createParamDecorator((field: keyof ITokenPayload | undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user: ITokenPayload | undefined = request[REQUEST_USER_KEY];
  return field ? user?.[field] : user;
});
