const PAYMENT_PAID = 'paid'
const PAYMENT_UNPAID = 'unpaid'

export const PaymentStatusEnum = {
  PAID: PAYMENT_PAID,
  UNPAID: PAYMENT_UNPAID,
} as const

export type PaymentStatusType =
  (typeof PaymentStatusEnum)[keyof typeof PaymentStatusEnum]

export { PAYMENT_PAID, PAYMENT_UNPAID }
