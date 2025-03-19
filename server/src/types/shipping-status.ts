const SHIPPING_UNSHIPPED = 'unshipped'
const SHIPPING_SHIPPED = 'shipped'
const SHIPPING_DELIVERED = 'delivered'

export const ShippingStatusEnum = {
  UNSHIPPED: SHIPPING_UNSHIPPED,
  SHIPPED: SHIPPING_SHIPPED,
  DELIVERED: SHIPPING_DELIVERED,
}

export type ShippingStatusType =
  (typeof ShippingStatusEnum)[keyof typeof ShippingStatusEnum]

export { SHIPPING_UNSHIPPED, SHIPPING_SHIPPED, SHIPPING_DELIVERED }
