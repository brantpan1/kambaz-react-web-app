import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@services/api'

export interface AuthState {
  currentUser: User | null
  token: string | null
}

const initialState: AuthState = { currentUser: null, token: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
    },
    resetAuth: (state) => {
      state.currentUser = null
      state.token = null
    },
  },
})

export const { setCurrentUser, setToken, resetAuth } = authSlice.actions
export default authSlice.reducer
