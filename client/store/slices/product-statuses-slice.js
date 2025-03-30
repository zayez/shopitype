import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  productStatuses: [],
  message: '',
  error: '',
}

export const fetchProductStatuses = createAsyncThunk(
  'productStatuses/fetchProductStatuses',
  async () => {
    return fetch(`/api/productStatuses`).then((res) => res.json())
  },
)

const productStatusesSlice = createSlice({
  name: 'productStatuses',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProductStatuses.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchProductStatuses.fulfilled, (state, action) => {
      state.loading = false
      state.productStatuses = action.payload
      state.error = ''
    })
    builder.addCase(fetchProductStatuses.rejected, (state, action) => {
      state.loading = false
      state.productStatuses = []
      state.error = action.error.message
    })
  },
})

export const selectProductStatuses = (state) => state.productStatuses

export default productStatusesSlice.reducer
