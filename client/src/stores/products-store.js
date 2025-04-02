import { create } from 'zustand'
import { ActionStatus } from '../types/action-status'

export const useProductsStore = create((set, get) => ({
  loading: false,
  products: [],
  currentProduct: null,
  error: '',
  errors: [],

  fetchProducts: async () => {
    console.log('pending')
    set({ loading: true, currentProduct: null, products: [] })
    try {
      const response = await fetch(`/api/products`)
      const res = await response.json()
      set({ loading: false, products: res, error: '' })
    } catch (error) {
      set({ loading: false, products: [], error: error.message })
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      set({ loading: false, currentProduct: data, error: '' })
      return data
    } catch (error) {
      set({ loading: false, currentProduct: null, error: error.message })
    }
  },

  createProduct: async (formData) => {
    set({ loading: true })
    const reqOpts = {
      method: 'POST',
      body: formData,
    }
    try {
      const res = await fetch(`/api/products`, reqOpts)
      if (res.status === 201) {
        const data = await res.json()
        set({ loading: false, currentProduct: data, error: '' })
        return data
      } else if (res.status === 422) {
        const data = await res.json()
        set({
          loading: false,
          error: 'There are errors on the form.',
          errors: data['invalid-params']
            ? data['invalid-params'].map((param) => param.reason)
            : [],
        })
        return
      } else {
        set({ loading: false, error: ActionStatus.Error })
        return
      }
    } catch (error) {
      set({ loading: false, error: error.message })
      return
    }
  },

  updateProduct: async ({ id, formData }) => {
    set({ loading: true })
    const reqOpts = {
      method: 'PATCH',
      body: formData,
    }
    const url = `/api/products/${id}`
    try {
      const res = await fetch(url, reqOpts)
      switch (res.status) {
        case 200: {
          const data = await res.json()
          set({ loading: false, currentProduct: data, error: '' })
          return data
        }
        case 400: {
          const data = await res.json()
          set({ loading: false, error: data })
          return data
        }
        case 422: {
          const data = await res.json()
          set({
            loading: false,
            error: 'There are errors on the form.',
            errors: data['invalid-params']
              ? data['invalid-params'].map((param) => param.reason)
              : [],
          })
          return
        }
        default:
          set({ loading: false, error: ActionStatus.Error })
          return
      }
    } catch (error) {
      set({ loading: false, error: error.message })
      return
    }
  },

  destroyProduct: async (id) => {
    set({ loading: true })
    const reqOpts = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
    const url = `/api/products/${id}`
    try {
      const res = await fetch(url, reqOpts)
      switch (res.status) {
        case 200: {
          const data = await res.json()
          set((state) => ({
            loading: false,
            products: state.products.filter((x) => x.id !== id),
            error: '',
          }))
          return { id, data }
        }
        case 422: {
          const data = await res.json()
          set({ loading: false, error: data })
          return
        }
        case 400:
        default:
          set({ loading: false, error: ActionStatus.Error })
          return
      }
    } catch (error) {
      set({ loading: false, error: error.message })
      return
    }
  },

  resetProduct: () => set({ currentProduct: null }),
}))
