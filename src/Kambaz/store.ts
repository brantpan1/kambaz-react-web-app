import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from '@services/api'
import auth from '@features/account/authSlice'
import { authListener } from '@app/authListeners'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
  },
  middleware: (getDefault) =>
    getDefault({
    }).concat(api.middleware, authListener.middleware),
  devTools: import.meta.env.DEV,
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
