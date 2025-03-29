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

import auth from './slices/authSlice'
import categories from './slices/categoriesSlice'
import products from './slices/productsSlice'
import productStatuses from './slices/productStatusesSlice'
import users from './slices/usersSlice'
import cart from './slices/cartSlice'
import orders from './slices/ordersSlice'

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

export const store = (preloadedState) => {
  return configureStore({
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
}

export const persistor = persistStore(store())
