// src/Kambaz/features/assignments/assignmentsApi.ts
import { api } from '@services/api'

export interface Assignment {
  _id: string
  title: string
  course: string
  description: string
  points: number
  dueDate: string
  availableDate: string
  availableUntil?: string
  modules: string[]
}

export const assignmentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAssignmentsByCourse: build.query<Assignment[], string>({
      query: (cid) => ({ url: `/api/courses/${cid}/assignments` }),
      providesTags: (result, _err, cid) =>
        result
          ? [
              { type: 'Assignment' as const, id: `LIST-${cid}` },
              ...result.map((a) => ({
                type: 'Assignment' as const,
                id: a._id,
              })),
            ]
          : [{ type: 'Assignment' as const, id: `LIST-${cid}` }],
    }),

    getAssignmentById: build.query<Assignment, string>({
      query: (id) => ({ url: `/api/assignments/${id}` }),
      providesTags: (_res, _err, id) => [{ type: 'Assignment', id }],
    }),

    createAssignment: build.mutation<
      Assignment,
      { courseId: string; body: Partial<Assignment> }
    >({
      query: ({ courseId, body }) => ({
        url: `/api/courses/${courseId}/assignments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, { courseId }) => [
        { type: 'Assignment', id: `LIST-${courseId}` },
      ],
    }),

    updateAssignment: build.mutation<
      Assignment,
      { id: string; patch: Partial<Assignment> }
    >({
      query: ({ id, patch }) => ({
        url: `/api/assignments/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Assignment', id }],
    }),

    deleteAssignment: build.mutation<
      { success?: boolean; id?: string },
      { courseId: string; id: string }
    >({
      query: ({ id }) => ({
        url: `/api/assignments/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ courseId, id }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          assignmentsApi.util.updateQueryData(
            'getAssignmentsByCourse',
            courseId,
            (draft) => {
              const i = draft.findIndex((a) => a._id === id)
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
      invalidatesTags: (_res, _err, { courseId, id }) => [
        { type: 'Assignment', id: `LIST-${courseId}` },
        { type: 'Assignment', id },
      ],
    }),
  }),
})

export const {
  useGetAssignmentsByCourseQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentsApi
