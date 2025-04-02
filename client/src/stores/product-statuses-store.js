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
      const data = await res.json()
      set({ loading: false, productStatuses: data, error: '' })
      return data
    } catch (error) {
      set({ loading: false, productStatuses: [], error: error.message })
      throw error
    }
  },
}))
