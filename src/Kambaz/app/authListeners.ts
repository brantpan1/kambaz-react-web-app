import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { setCurrentUser, resetAuth } from '@features/account/authSlice'
import { authApi } from '@features/account/authApi'
import { api, User } from '@services/api'

export const authListener = createListenerMiddleware()

authListener.startListening({
  matcher: isAnyOf(
    authApi.endpoints.me.matchFulfilled,
    authApi.endpoints.signin.matchFulfilled,
    authApi.endpoints.signup.matchFulfilled,
    authApi.endpoints.updateUser.matchFulfilled,
  ),
  effect: async (action, { dispatch }) => {
    dispatch(setCurrentUser(action.payload as User ?? null))
  },
})

authListener.startListening({
  matcher: isAnyOf(authApi.endpoints.signout.matchFulfilled),
  effect: async (_action, { dispatch }) => {
    dispatch(resetAuth())
    dispatch(api.util.resetApiState())
  },
})
