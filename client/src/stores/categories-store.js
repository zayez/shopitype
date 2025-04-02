import { create } from 'zustand'
import { ActionStatus } from '../types/action-status'

export const useCategoriesStore = create((set, get) => ({
  loading: false,
  categories: [],
  category: null,
  message: null,
  error: '',
  errors: [],

  fetchCategories: async () => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/categories`)
      const data = await res.json()
      set({
        loading: false,
        categories: data,
        category: null,
        error: '',
      })
    } catch (error) {
      set({ loading: false, categories: [], error: error.message })
    }
  },

  fetchCategory: async (id) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/categories/${id}`)
      const data = await res.json()
      set({ loading: false, category: data, error: '' })
    } catch (error) {
      set({ loading: false, category: null, error: error.message })
    }
  },

  updateCategory: async ({ id, title }) => {
    set({ loading: true })
    const categoryPayload = {}
    if (title) categoryPayload.title = title

    const reqOpts = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryPayload),
    }

    const url = `/api/categories/${id}`
    try {
      const res = await fetch(url, reqOpts)
      if (res.status === 200) {
        const data = await res.json()
        set({ loading: false, category: data, error: '' })
        return data
      } else if (res.status === 400) {
        const data = await res.json()
        set({ loading: false, error: data })
      } else if (res.status === 422) {
        const data = await res.json()
        set({
          loading: false,
          error: 'There are errors on the form.',
          errors: data['invalid-params']
            ? data['invalid-params'].map((param) => param.reason)
            : [],
        })
      } else {
        const data = await res.json()
        set({ loading: false, error: data.detail || ActionStatus.Error })
      }
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },

  createCategory: async ({ title }) => {
    set({ loading: true })
    const categoryPayload = {}
    if (title) categoryPayload.title = title

    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryPayload),
    }

    const url = `/api/categories`
    try {
      const res = await fetch(url, reqOpts)
      if (res.status === 201) {
        const data = await res.json()
        set({
          loading: false,
          category: data,
          message: 'Category was successfully created.',
          error: '',
        })
        return data
      } else if (res.status === 400) {
        set({ loading: false, error: ActionStatus.Error })
        return await res.json()
      } else if (res.status === 422) {
        const data = await res.json()
        set({
          loading: false,
          error: 'There are errors on the form.',
          errors: data['invalid-params']
            ? data['invalid-params'].map((param) => param.reason)
            : [],
        })
      } else {
        set({ loading: false, error: ActionStatus.Error })
      }
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },

  destroyCategory: async (id) => {
    set({ loading: true })
    const reqOpts = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }

    const url = `/api/categories/${id}`
    try {
      const res = await fetch(url, reqOpts)
      if (res.status === 200) {
        await res.json()
        set((state) => ({
          loading: false,
          categories: state.categories.filter((c) => c.id !== id),
          error: '',
        }))
      } else if (res.status === 400) {
        set({ loading: false, error: ActionStatus.Error })
      } else if (res.status === 422) {
        const data = await res.json()
        set({ loading: false, error: data })
      } else {
        set({ loading: false, error: ActionStatus.Error })
      }
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },

  resetCategory: () => set({ category: null, message: null }),
  removeMessage: () => set({ message: '' }),
  resetCategories: () => set({ categories: [] }),
}))
