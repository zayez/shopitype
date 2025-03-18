export interface Order {
  userId?: number
  id?: number
  customer?: any
  items?: OrderItem
  total?: number
  subtotal?: number
  paymentStatus?: string
  paymentStatusId?: number
  shippingAddressId?: number
  shippingAddress?: any
  shippingStatus?: any
  dateOrder?: any
  createdAt?: any
  updatedAt?: any
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
  createdAt?: any
  updatedAt?: any
}

export interface ShippingAddress {
  addressLine1?: string
  addressLine2?: string
  city?: string
  country?: string
  state?: string
  postalCode?: string
  createdAt?: any
  updatedAt?: any
}
