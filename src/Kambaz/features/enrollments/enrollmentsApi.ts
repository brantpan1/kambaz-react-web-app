import { api } from '@services/api'
import type { Course } from '@features/courses/coursesApi'

export interface EnrollmentStatus {
  success?: boolean
}

export const enrollmentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMyEnrollments: build.query<string[], void>({
      query: () => ({ url: '/api/courses/enrolled' }),
      transformResponse: (courses: Course[]) => courses.map((c) => c._id),
      providesTags: [{ type: 'Enrollment', id: 'MY' }, 'Session'],
    }),

    enrollInCourse: build.mutation<EnrollmentStatus, string>({
      query: (courseId) => ({
        url: `/api/courses/${courseId}/enroll`,
        method: 'POST',
      }),
      async onQueryStarted(courseId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          enrollmentsApi.util.updateQueryData(
            'getMyEnrollments',
            undefined,
            (draft) => {
              if (!draft.includes(courseId)) draft.push(courseId)
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: [
        { type: 'Enrollment', id: 'MY' },
        { type: 'Course', id: 'LIST-MY' },
        { type: 'Course', id: 'LIST-ALL' },
        'Session',
      ],
    }),

    unenrollFromCourse: build.mutation<EnrollmentStatus, string>({
      query: (courseId) => ({
        url: `/api/courses/${courseId}/enroll`,
        method: 'DELETE',
      }),
      async onQueryStarted(courseId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          enrollmentsApi.util.updateQueryData(
            'getMyEnrollments',
            undefined,
            (draft) => {
              const i = draft.indexOf(courseId)
              if (i !== -1) draft.splice(i, 1)
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: [
        { type: 'Enrollment', id: 'MY' },
        { type: 'Course', id: 'LIST-MY' },
        { type: 'Course', id: 'LIST-ALL' },
        'Session',
      ],
    }),
  }),
})

export const {
  useGetMyEnrollmentsQuery,
  useEnrollInCourseMutation,
  useUnenrollFromCourseMutation,
} = enrollmentsApi
