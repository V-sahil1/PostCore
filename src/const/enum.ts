export const USER_ROLES = {
  ADMIN: "Admin",
  USER: "User",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
