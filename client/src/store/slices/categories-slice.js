import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ActionStatus } from '../../types/action-status'

const initialState = {
  loading: false,
  categories: [],
  category: null,
  message: null,
  error: '',
  errors: [],
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    return fetch(`/api/categories`).then((res) => res.json())
  },
)

export const fetchCategory = createAsyncThunk(
  'categories/fetchCategory',
  async (id) => {
    return fetch(`/api/categories/${id}`).then((res) => res.json())
  },
)

export const update = createAsyncThunk(
  'categories/update',
  async ({ id, title }, { rejectWithValue }) => {
    const category = {}
    if (title) category.title = title
    const reqOpts = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    }

    const url = `/api/categories/${id}`
    return fetch(url, reqOpts).then(async (res) => {
      switch (res.status) {
        case 200:
          return res.json()
        case 400:
          return res.json()
        case 422:
          return rejectWithValue(await res.json())
        default:
          return rejectWithValue(ActionStatus.Error)
      }
    })
  },
)

export const create = createAsyncThunk(
  'categories/create',
  async ({ title }, { rejectWithValue }) => {
    const category = {}
    if (title) category.title = title

    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    }

    const url = `/api/categories`
    return fetch(url, reqOpts).then(async (res) => {
      switch (res.status) {
        case 201:
          return await res.json()
        case 400:
          rejectWithValue(ActionStatus.Error)
        case 422:
          return rejectWithValue(await res.json())
        default:
          return rejectWithValue(ActionStatus.Error)
      }
    })
  },
)

export const destroy = createAsyncThunk(
  'categories/destroy',
  async (id, { rejectWithValue }) => {
    const reqOpts = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }

    const url = `/api/categories/${id}`
    return fetch(url, reqOpts).then(async (res) => {
      switch (res.status) {
        case 200:
          return { id, data: await res.json() }
        case 400:
          return rejectWithValue(ActionStatus.Error)
        case 422:
          return rejectWithValue(await res.json())
        default:
          return rejectWithValue(ActionStatus.Error)
      }
    })
  },
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategory(state, action) {
      state.category = null
      state.message = null
    },
    removeMessage(state, action) {
      state.message = ''
    },
    resetCategories(state) {
      state.categories = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false
      state.categories = action.payload
      state.category = null
      state.error = ''
    })
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false
      state.categories = []
      state.error = action.error.message
    })

    builder.addCase(fetchCategory.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.loading = false
      state.category = action.payload
      state.error = ''
    })
    builder.addCase(fetchCategory.rejected, (state, action) => {
      state.loading = false
      state.category = null
      state.error = action.error.message
    })

    builder.addCase(update.pending, (state) => {
      state.loading = true
    })
    builder.addCase(update.fulfilled, (state, action) => {
      state.loading = false
      state.category = action.payload
      state.error = ''
    })
    builder.addCase(update.rejected, (state, action) => {
      state.loading = false
      switch (action.payload.status) {
        case 422:
          state.error = 'There are errors on the form.'
          state.errors = []
          action.payload['invalid-params'].forEach((param) => {
            state.errors.push(param.reason)
          })
          break
        default:
          state.error = action.payload.detail
          break
      }
    })

    builder.addCase(create.pending, (state) => {
      state.loading = true
    })
    builder.addCase(create.fulfilled, (state, action) => {
      state.loading = false
      state.category = action.payload
      state.message = 'Category was successfully created.'
      state.error = ''
    })
    builder.addCase(create.rejected, (state, action) => {
      state.loading = false
      switch (action.payload.status) {
        case 422:
          state.error = 'There are errors on the form.'
          state.errors = []
          action.payload['invalid-params'].forEach((param) => {
            state.errors.push(param.reason)
          })
          break
        default:
          state.error = action.payload.detail
          break
      }
    })

    builder.addCase(destroy.pending, (state) => {
      state.loading = true
    })
    builder.addCase(destroy.fulfilled, (state, action) => {
      state.loading = false
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload.id,
      )
      state.error = ''
    })
    builder.addCase(destroy.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export const selectCategories = (state) => state.categories

export const { resetCategory, resetCategories, removeMessage } =
  categoriesSlice.actions
export default categoriesSlice.reducer
