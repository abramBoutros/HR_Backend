// I use a POJO instead of ts enums as ts enums have very unexpected behavior in runtime
// this is a conviction followed by most of the open source projects

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  HR: 'HR',
  MARKETING: 'MARKETING',
  SALES: 'SALES',
  APP_SUPPORT: 'APP_SUPPORT',
  ENGINEER: 'ENGINEER',
} as const;

export type UserRoles = (typeof USER_ROLES)[keyof typeof USER_ROLES];
