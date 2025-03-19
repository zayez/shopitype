const PROD_ACTIVE = 'active'
const PROD_DRAFT = 'draft'

export const ProductStatusEnum = {
  ACTIVE: PROD_ACTIVE,
  DRAFT: PROD_DRAFT,
} as const

export { PROD_ACTIVE, PROD_DRAFT }
