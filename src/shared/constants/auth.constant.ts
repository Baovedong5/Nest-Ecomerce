export const REQUEST_USER_KEY = 'user';

export const Auth_Types = {
  Bearer: 'Bearer',
  APIKey: 'ApiKey',
  None: 'None',
} as const;

export type AuthTypeType = (typeof Auth_Types)[keyof typeof Auth_Types];

export const ConditionGuard = {
  And: 'and',
  Or: 'or',
} as const;

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const;

export const TypeOfVerifycationCode = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const;

export type TypeOfVerifycationCodeType = (typeof TypeOfVerifycationCode)[keyof typeof TypeOfVerifycationCode];
