import { create } from 'zustand'

export const useOrdersStore = create((set) => ({
  loading: false,
  orders: [],
  curOrder: null,
  error: '',

  fetchOrders: async () => {
    set({ loading: true })
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      set({ loading: false, orders: data, error: '' })
      return data
    } catch (error) {
      set({ loading: false, orders: [], error: error.message })
      throw error
    }
  },

  fetchOrder: async (id) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/orders/${id}`)
      const data = await res.json()
      set({ loading: false, curOrder: data, error: '' })
      return data
    } catch (error) {
      set({ loading: false, curOrder: null, error: error.message })
      throw error
    }
  },

  markShippingStatus: async ({ orderId, status }) => {
    set({ loading: true })
    const payload = { status }
    const reqOpts = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
    try {
      const res = await fetch(
        `/api/orders/mark-shipping-status/${orderId}/`,
        reqOpts,
      )
      const data = await res.json()
      set({ loading: false, curOrder: data, error: '' })
      return data
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },
}))
