import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ActionStatus } from '../../types/ActionStatus'

const initialState = {
  loading: false,
  user: null,
  error: '',
  success: false,
  // isLoggedIn: false
}

const baseUrl = `/api`

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    const url = `${baseUrl}/signin`
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
    return fetch(url, requestOptions).then((res) => {
      switch (res.status) {
        case 200:
          return res.json()
        case 401:
          return rejectWithValue(ActionStatus.Unauthorized)
        default:
          return rejectWithValue(ActionStatus.Error)
      }
    })
  },
)

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const url = `${baseUrl}/signout`
  return fetch(url).then((res) => res.status)
})

export const signUser = createAsyncThunk(
  'auth/signUser',
  async (_, { rejectWithValue }) => {
    const url = `${baseUrl}/user`
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(url, requestOptions).then((res) => {
      switch (res.status) {
        case 200:
          return res.json()
        default:
          return rejectWithValue(ActionStatus.Error)
      }
    })
  },
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ firstName, lastName, email, password }, { rejectWithValue }) => {
    const url = `${baseUrl}/signup`
    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    }
    return fetch(url, reqOpts).then(async (res) => {
      switch (res.status) {
        case 201:
          return res.json()
        case 400:
          return res.json()
        case 422:
          // const stuff = await res.json()
          return rejectWithValue(await res.json())
        default:
          return rejectWithValue(ActionStatus.Error)
      }
    })
  },
)

export const fetchUser = createAsyncThunk('auth/fetchUser', async ({ id }) => {
  return fetch(`/api/users/${id}`).then((res) => res.json())
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.success = true
      state.error = ''
    })
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false
      state.user = null
      state.success = false
      switch (action.payload) {
        case ActionStatus.Unauthorized:
          state.error = 'Invalid credentials.'
          break

        default:
          state.error = 'Internal server error.'
          break
      }
    })

    builder.addCase(signUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.success = true
      state.error = ''
    })
    builder.addCase(signUser.rejected, (state, action) => {
      state.loading = false
      state.user = null
      state.success = false
      switch (action.payload) {
        default:
          state.error = ''
          break
      }
    })

    builder.addCase(signOut.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signOut.fulfilled, (state, action) => {
      state.loading = false
      state.user = null
      state.success = false
      state.error = ''
    })
    builder.addCase(signOut.rejected, (state, action) => {
      state.loading = false
      state.user = null
      state.success = false
      state.error = 'Whoa. Something has gone wrong.'
    })

    builder.addCase(signUp.pending, (state) => {
      state.loading = false
    })
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.success = true
      state.error = ''
    })
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false
      state.user = null
      state.success = false
      state.error = action.payload.detail
    })

    builder.addCase(fetchUser.pending, (state) => {
      state.loading = false
    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.success = true
      state.error = ''
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.user = null
      state.success = false
      state.error = action.payload?.detail
    })
  },
})

export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user

export default authSlice.reducer
