import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/store'

export type User = {
  _id: string
  username: string
  password?: string
  firstName?: string
  lastName?: string
  email?: string
  dob?: string
  role?: 'STUDENT' | 'FACULTY' | 'ADMIN'
  loginId?: string
  section?: string
  lastActivity?: string
  totalActivity?: string
}

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: [
    'Me',
    'Course',
    'Person',
    'Module',
    'Assignment',
    'Enrollment',
    'Session',
    'Quiz',
    'Question',
    'Attempt',
  ],
  endpoints: () => ({}),
})
