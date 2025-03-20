export const RoleEnum = {
  Admin: 'admin',
  Editor: 'editor',
  Customer: 'customer',
} as const

export type RoleType = (typeof RoleEnum)[keyof typeof RoleEnum]
