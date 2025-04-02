import { create } from 'zustand'

const baseUrl = `/api`

export const useAuthStore = create((set) => ({
  loading: false,
  user: null,
  error: '',
  success: false,

  signIn: async ({ email, password }) => {
    set({ loading: true })
    const url = `${baseUrl}/signin`
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }

    try {
      const res = await fetch(url, requestOptions)
      if (res.status === 200) {
        const data = await res.json()
        set({
          loading: false,
          user: data.user,
          success: true,
          error: '',
        })
      } else if (res.status === 401) {
        set({
          loading: false,
          user: null,
          success: false,
          error: 'Invalid credentials.',
        })
      } else {
        set({
          loading: false,
          user: null,
          success: false,
          error: 'Internal server error.',
        })
      }
    } catch (error) {
      set({
        loading: false,
        user: null,
        success: false,
        error: 'Internal server error.',
      })
    }
  },

  signOut: async () => {
    set({ loading: true })
    const url = `${baseUrl}/signout`
    try {
      await fetch(url)
      set({
        loading: false,
        user: null,
        success: false,
        error: '',
      })
    } catch (error) {
      set({
        loading: false,
        user: null,
        success: false,
        error: 'Whoa. Something has gone wrong.',
      })
    }
  },

  signUser: async () => {
    set({ loading: true })
    const url = `${baseUrl}/user`
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }

    try {
      const res = await fetch(url, requestOptions)
      if (res.status === 200) {
        const data = await res.json()
        set({
          loading: false,
          user: data,
          success: true,
          error: '',
        })
      } else {
        set({
          loading: false,
          user: null,
          success: false,
          error: '',
        })
      }
    } catch (error) {
      set({
        loading: false,
        user: null,
        success: false,
        error: '',
      })
    }
  },

  signUp: async ({ firstName, lastName, email, password }) => {
    set({ loading: true })
    const url = `${baseUrl}/signup`
    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    }

    try {
      const res = await fetch(url, reqOpts)
      if (res.status === 201) {
        const data = await res.json()
        set({
          loading: false,
          user: data.user,
          success: true,
          error: '',
        })
      } else if (res.status === 400) {
        const data = await res.json()
        set({
          loading: false,
          user: null,
          success: false,
          error: data,
        })
      } else if (res.status === 422) {
        const data = await res.json()
        set({
          loading: false,
          user: null,
          success: false,
          error: data.detail,
        })
      } else {
        set({
          loading: false,
          user: null,
          success: false,
          error: 'Internal server error.',
        })
      }
    } catch (error) {
      set({
        loading: false,
        user: null,
        success: false,
        error: 'Internal server error.',
      })
    }
  },

  fetchUser: async ({ id }) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/users/${id}`)
      const data = await res.json()
      set({
        loading: false,
        user: data,
        success: true,
        error: '',
      })
    } catch (error) {
      set({
        loading: false,
        user: null,
        success: false,
        error: error?.detail || 'Internal server error.',
      })
    }
  },
}))
