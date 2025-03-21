import { PaymentStatusType } from '../types/payment-status'
import { ShippingStatusType } from '../types/shipping-status'
import { User } from './user'

export interface Order {
  userId?: number
  id?: number
  customer?: User
  items?: OrderItem[]
  total?: number
  subtotal?: number
  paymentStatus?: PaymentStatusType
  paymentStatusId?: number
  shippingAddressId?: number
  shippingAddress: ShippingAddress
  shippingStatus?: ShippingStatusType
  dateOrder?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface OrderItem {
  id?: number
  title?: string
  image?: string
  productId?: number
  price?: number
  total?: number
  subtotal?: number
  quantity?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface ShippingAddress {
  id?: number
  addressLine1?: string
  addressLine2?: string
  city?: string
  country?: string
  state?: string
  postalCode?: number
  createdAt?: Date
  updatedAt?: Date
}
