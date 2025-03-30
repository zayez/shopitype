import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ActionStatus } from '../../types/action-status'

const initialState = {
  loading: false,
  products: [],
  currentProduct: null,
  error: '',
  errors: [],
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    return fetch(`/api/products`).then((res) => res.json())
  },
)

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id) => {
    return fetch(`/api/products/${id}`).then((res) => res.json())
  },
)

export const create = createAsyncThunk(
  'products/create',
  async (formData, { rejectWithValue }) => {
    const reqOpts = {
      method: 'POST',
      body: formData,
    }
    return fetch(`/api/products`, reqOpts).then(async (res) => {
      switch (res.status) {
        case 201:
          return await res.json()
        case 422:
          return rejectWithValue(await res.json())
        default:
          return rejectWithValue(ActionStatus.Error)
      }
    })
  },
)

export const update = createAsyncThunk(
  'products/update',
  async ({ id, formData }, { rejectWithValue }) => {
    const reqOpts = {
      method: 'PATCH',
      body: formData,
    }

    const url = `/api/products/${id}`
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

export const destroy = createAsyncThunk(
  'products/destroy',
  async (id, { rejectWithValue }) => {
    const reqOpts = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
    const url = `/api/products/${id}`
    return fetch(url, reqOpts).then(async (res) => {
      switch (res.status) {
        case 200:
          return { id, data: await res.json() }
        case 422:
          return rejectWithValue(await res.json())
        case 400:
        default:
          return rejectWithValue(ActionStatus.Error)
      }
    })
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProduct(state, action) {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false
      state.products = action.payload
      state.error = ''
    })
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false
      state.products = []
      state.error = action.error.message
    })
    builder.addCase(fetchProduct.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.loading = false
      state.currentProduct = action.payload
      state.error = ''
    })
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false
      state.currentProduct = null
      state.error = action.error.message
    })

    builder.addCase(create.pending, (state) => {
      state.loading = true
    })
    builder.addCase(create.fulfilled, (state, action) => {
      state.loading = false
      state.currentProduct = action.payload
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

    builder.addCase(update.pending, (state) => {
      state.loading = true
    })
    builder.addCase(update.fulfilled, (state, action) => {
      state.loading = false
      state.currentProduct = action.payload
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

    builder.addCase(destroy.pending, (state) => {
      state.loading = true
    })
    builder.addCase(destroy.fulfilled, (state, action) => {
      state.loading = false
      state.products = state.products.filter((x) => x.id !== action.payload.id)
      state.error = ''
    })
    builder.addCase(destroy.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export const selectProducts = (state) => state.products
export const selectCurrentProduct = (state) => state.products.currentProduct

export const { resetProduct } = productsSlice.actions

export default productsSlice.reducer
