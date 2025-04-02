import { create } from 'zustand'

export const useUsersStore = create((set) => ({
  loading: false,
  users: [],
  error: '',
  selectedUser: null,

  fetchUsers: async () => {
    set({ loading: true })
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      set({ loading: false, users: data, error: '' })
    } catch (error) {
      set({ loading: false, users: [], error: error.message })
    }
  },

  fetchUser: async (id) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/users/${id}`)
      const data = await res.json()
      set({ loading: false, selectedUser: data, error: '' })
    } catch (error) {
      set({ loading: false, selectedUser: null, error: error.message })
    }
  },

  fetchUsersByRoles: async (roles) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/users?roles=${roles.join(',')}`)
      const data = await res.json()
      set({ loading: false, users: data, error: '' })
    } catch (error) {
      set({ loading: false, users: [], error: error.message })
    }
  },

  updateUser: async ({ id, firstName, lastName, email }) => {
    set({ loading: true })
    const user = {}
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (email) user.email = email

    const reqOpts = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    }

    try {
      await fetch(`/api/users/${id}`, reqOpts)
      set({ loading: false, error: '' })
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },
}))
