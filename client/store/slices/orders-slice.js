import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ActionStatus } from '../../types/action-status'
import { toast } from 'react-toastify'

const initialState = {
  loading: false,
  orders: [],
  curOrder: null,
  error: '',
}

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  return fetch(`/api/orders`).then((res) => res.json())
})

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async (id) => {
  return fetch(`/api/orders/${id}`).then((res) => res.json())
})

export const markShippingStatus = createAsyncThunk(
  'orders/markShippingStatus',
  async ({ orderId, status }) => {
    const payload = { status }
    const reqOpts = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
    return fetch(`/api/orders/mark-shipping-status/${orderId}/`, reqOpts).then(
      (res) => res.json(),
    )
  },
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false
      state.orders = action.payload
      state.error = ''
    })
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false
      state.orders = []
      state.error = action.error.message
    })

    builder.addCase(fetchOrder.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.loading = false
      state.curOrder = action.payload
      state.error = ''
    })
    builder.addCase(fetchOrder.rejected, (state, action) => {
      state.loading = false
      state.curOrder = null
      state.error = action.error.message
    })

    builder.addCase(markShippingStatus.pending, (state) => {
      state.loading = true
    })
    builder.addCase(markShippingStatus.fulfilled, (state, action) => {
      state.loading = false
      state.curOrder = action.payload
      state.error = ''
    })
    builder.addCase(markShippingStatus.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export const selectOrders = (state) => state.orders

export default ordersSlice.reducer
