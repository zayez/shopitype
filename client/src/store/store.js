import {
  combineReducers,
  configureStore,
  // getDefaultMiddleware,
} from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import auth from './slices/auth-slice'
import categories from './slices/categories-slice'
import products from './slices/products-slice'
import productStatuses from './slices/product-statuses-slice'
import users from './slices/users-slice'
import cart from './slices/cart-slice'
import orders from './slices/orders-slice'

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  auth,
  categories,
  products,
  productStatuses,
  users,
  cart,
  orders,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const createAppStore = (preloadedState) => {
  const store = configureStore({
    reducer: persistedReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  })

  const persistor = persistStore(store)

  return {
    store,
    persistor,
  }
}
