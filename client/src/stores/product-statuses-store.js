import { create } from 'zustand'

export const useProductStatusesStore = create((set) => ({
  loading: false,
  productStatuses: [],
  message: '',
  error: '',

  fetchProductStatuses: async () => {
    set({ loading: true })
    try {
      const res = await fetch('/api/productStatuses')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        set({ loading: false, productStatuses: [], error: body.message })
        throw new Error(body.message)
      }
      const data = await res.json()
      set({ loading: false, productStatuses: data, error: '' })
      return data
    } catch (error) {
      set({ loading: false, productStatuses: [], error: error.message })
      throw error
    }
  },
}))
