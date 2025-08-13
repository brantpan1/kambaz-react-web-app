// src/Kambaz/features/courses/coursesApi.ts
import { api } from '@services/api'

export interface Course {
  _id: string
  name: string
  title?: string
  description?: string
  image?: string
  enrolled?: boolean
}

export const coursesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllCourses: build.query<Course[], void>({
      query: () => ({ url: '/api/courses' }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Course' as const, id: 'LIST-ALL' },
              ...result.map((c) => ({ type: 'Course' as const, id: c._id })),
            ]
          : [{ type: 'Course' as const, id: 'LIST-ALL' }],
    }),

    getMyCourses: build.query<Course[], void>({
      query: () => ({ url: '/api/users/current/courses' }),
      providesTags: (result) =>
        result
          ? [
              'Session',
              { type: 'Course' as const, id: 'LIST-MY' },
              ...result.map((c) => ({ type: 'Course' as const, id: c._id })),
            ]
          : ['Session', { type: 'Course' as const, id: 'LIST-MY' }],
    }),

    getCourseById: build.query<Course, string>({
      query: (id) => ({ url: `/api/courses/${id}` }),
      providesTags: (_r, _e, id) => [{ type: 'Course', id }],
    }),

    createCourse: build.mutation<Course, Partial<Course>>({
      query: (body) => ({
        url: '/api/users/current/courses',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Course', id: 'LIST-ALL' },
        { type: 'Course', id: 'LIST-MY' },
        'Session',
      ],
    }),

    updateCourse: build.mutation<
      Course,
      { id: string; patch: Partial<Course> }
    >({
      query: ({ id, patch }) => ({
        url: `/api/courses/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Course', id }],
    }),

    deleteCourse: build.mutation<{ deletedCount?: number }, string>({
      query: (id) => ({ url: `/api/courses/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Course', id: 'LIST-ALL' },
        { type: 'Course', id: 'LIST-MY' },
        'Session',
      ],
    }),
  }),
})

export const {
  useGetAllCoursesQuery,
  useGetMyCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi
