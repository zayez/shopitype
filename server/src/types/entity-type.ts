export const EntityEnum = {
  User: 'user',
  Category: 'category',
  Product: 'product',
  ProductStatus: 'productstatus',
  Order: 'order',
} as const

export type EntityType = (typeof EntityEnum)[keyof typeof EntityEnum]
