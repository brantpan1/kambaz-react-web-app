import { api } from '@services/api'
import type { User } from '@services/api'
import { setCurrentUser } from './authSlice'

export interface Credentials {
  username: string
  password: string
}
export interface SignupPayload extends Credentials {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<User | null, void>({
      query: () => ({ url: '/api/users/profile', method: 'POST' }),
      providesTags: ['Session', 'Me'],
      transformResponse: (resp: User) => resp ?? null,
    }),
    signin: build.mutation<User, Credentials>({
      query: (body) => ({ url: '/api/users/signin', method: 'POST', body }),
      invalidatesTags: ['Session', 'Me'],
    }),
    signup: build.mutation<User, SignupPayload>({
      query: (body) => ({ url: '/api/users/signup', method: 'POST', body }),
      invalidatesTags: ['Session', 'Me'],
    }),
    signout: build.mutation<void, void>({
      query: () => ({ url: '/api/users/signout', method: 'POST' }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(authApi.util.updateQueryData('me', undefined, () => null))
        dispatch(setCurrentUser(null))
        try {
          await queryFulfilled
        } catch {}
      },
    }),
    updateUser: build.mutation<User, { userId: string; patch: Partial<User> }>({
      query: ({ userId, patch }) => ({
        url: `/api/users/${userId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Session', 'Me'],
    }),
  }),
})

export const {
  useMeQuery,
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useUpdateUserMutation,
} = authApi
