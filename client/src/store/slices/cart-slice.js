import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ActionStatus } from '../../types/action-status'

const initialState = {
  loading: false,
  isCheckoutComplete: false,
  items: [],
  subtotal: 0,
  error: '',
  targetUrl: '',
}

export const createStripeCheckout = createAsyncThunk(
  'cart/createStripeCheckout',
  async ({ items, userId }, { rejectWithValue }) => {
    const body = { items, userId }
    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
    const url = `/api/stripe-checkout`
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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const item = { ...action.payload, quantity: 1 }
      const index = state.items.findIndex((i) => i.id === item.id)
      if (index < 0) {
        state.items = [...state.items, item]
      } else {
        state.items[index].quantity = state.items[index].quantity + 1
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    increaseItem(state, action) {
      const id = action.payload
      const index = state.items.findIndex((i) => i.id === id)
      state.items[index].quantity = state.items[index].quantity + 1
    },
    decreaseItem(state, action) {
      const id = action.payload
      const index = state.items.findIndex((i) => i.id === id)
      if (state.items[index].quantity === 1) {
        state.items = state.items.filter((i) => i.id !== id)
        return
      } else {
        state.items[index].quantity = state.items[index].quantity - 1
      }
    },
    clearCart(state, action) {
      state.items = []
    },
    calculateSubtotal(state, action) {
      const total = state.items.reduce(
        (acc, cur) => acc + cur.price * cur.quantity,
        0,
      )

      state.subtotal = total
    },
    resetCheckout(state, action) {
      state.targetUrl = ''
      state.isCheckoutComplete = false
    },
  },

  extraReducers: (builder) => {
    builder.addCase(createStripeCheckout.pending, (state) => {
      state.loading = true
    })

    builder.addCase(createStripeCheckout.fulfilled, (state, action) => {
      state.loading = false
      state.targetUrl = action.payload.url
      state.isCheckoutComplete = true
      state.error = ''
    })

    builder.addCase(createStripeCheckout.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export const {
  addItem,
  removeItem,
  increaseItem,
  decreaseItem,
  clearCart,
  calculateSubtotal,
  resetCheckout,
} = cartSlice.actions
export const selectCart = (state) => state.cart

export default cartSlice.reducer
