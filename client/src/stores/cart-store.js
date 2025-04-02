import { create } from 'zustand'
import { ActionStatus } from '../types/action-status'

export const useCartStore = create((set, get) => ({
  loading: false,
  isCheckoutComplete: false,
  items: [],
  subtotal: 0,
  error: '',
  targetUrl: '',

  createStripeCheckout: async ({ items, userId }) => {
    set({ loading: true })
    const body = { items, userId }
    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
    const url = `/api/stripe-checkout`
    try {
      const res = await fetch(url, reqOpts)
      switch (res.status) {
        case 200: {
          const data = await res.json()
          set({
            loading: false,
            targetUrl: data.url,
            isCheckoutComplete: true,
            error: '',
          })
          return data
        }
        case 400: {
          const data = await res.json()
          set({ loading: false })
          return data
        }
        case 422: {
          const errorData = await res.json()
          set({ loading: false, error: errorData })
          throw errorData
        }
        default: {
          set({ loading: false, error: ActionStatus.Error })
          throw new Error(ActionStatus.Error)
        }
      }
    } catch (error) {
      set({ loading: false, error: error.message || 'Internal error' })
      throw error
    }
  },

  addItem: (item) => {
    set((state) => {
      const newItem = { ...item, quantity: 1 }
      const index = state.items.findIndex((i) => i.id === newItem.id)
      if (index < 0) {
        return { items: [...state.items, newItem] }
      } else {
        const updatedItems = [...state.items]
        updatedItems[index].quantity += 1
        return { items: updatedItems }
      }
    })
  },

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  increaseItem: (id) => {
    set((state) => {
      const index = state.items.findIndex((item) => item.id === id)
      if (index >= 0) {
        const updatedItems = [...state.items]
        updatedItems[index].quantity += 1
        return { items: updatedItems }
      }
    })
  },

  decreaseItem: (id) => {
    set((state) => {
      const index = state.items.findIndex((item) => item.id === id)
      if (index >= 0) {
        const updatedItems = [...state.items]
        if (updatedItems[index].quantity === 1) {
          return { items: updatedItems.filter((item) => item.id !== id) }
        } else {
          updatedItems[index].quantity -= 1
          return { items: updatedItems }
        }
      }
    })
  },

  clearCart: () => set({ items: [] }),

  calculateSubtotal: () => {
    set((state) => {
      const total = state.items.reduce(
        (acc, cur) => acc + cur.price * cur.quantity,
        0,
      )
      return { subtotal: total }
    })
  },

  resetCheckout: () =>
    set({
      targetUrl: '',
      isCheckoutComplete: false,
    }),
}))
