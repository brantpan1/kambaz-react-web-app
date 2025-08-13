import { api } from '@services/api'

export interface Lesson {
  _id: string
  name: string
  description?: string
}

export interface Module {
  _id: string
  course: string
  name: string
  description?: string
  lessons?: Lesson[]
}

type CourseId = string

export const modulesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getModulesByCourse: build.query<Module[], CourseId>({
      query: (cid) => ({ url: `/api/courses/${cid}/modules` }),
      providesTags: (result, _err, cid) =>
        result
          ? [
              { type: 'Module' as const, id: `LIST-${cid}` },
              ...result.map((m) => ({ type: 'Module' as const, id: m._id })),
            ]
          : [{ type: 'Module' as const, id: `LIST-${cid}` }],
    }),

    createModule: build.mutation<
      Module,
      { courseId: string; body: Partial<Module> }
    >({
      query: ({ courseId, body }) => ({
        url: `/api/courses/${courseId}/modules`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, { courseId }) => [
        { type: 'Module', id: `LIST-${courseId}` },
      ],
    }),

    updateModule: build.mutation<
      Module,
      { courseId: string; id: string; patch: Partial<Module> }
    >({
      query: ({ id, patch }) => ({
        url: `/api/modules/${id}`,
        method: 'PUT',
        body: patch,
      }),
      async onQueryStarted(
        { courseId, id, patch },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          modulesApi.util.updateQueryData(
            'getModulesByCourse',
            courseId,
            (draft) => {
              const idx = draft.findIndex((m) => m._id === id)
              if (idx !== -1) Object.assign(draft[idx], patch)
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Module', id }],
    }),

    deleteModule: build.mutation<
      { success?: boolean; id: string },
      { courseId: string; id: string }
    >({
      query: ({ id }) => ({
        url: `/api/modules/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ courseId, id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          modulesApi.util.updateQueryData(
            'getModulesByCourse',
            courseId,
            (draft) => {
              const idx = draft.findIndex((m) => m._id === id)
              if (idx !== -1) draft.splice(idx, 1)
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_res, _err, { courseId }) => [
        { type: 'Module', id: `LIST-${courseId}` },
      ],
    }),

    addLesson: build.mutation<
      Module,
      { courseId: string; moduleId: string; lesson: Partial<Lesson> }
    >({
      query: ({ moduleId, lesson }) => ({
        url: `/api/modules/${moduleId}/lessons`,
        method: 'POST',
        body: { lesson },
      }),
      invalidatesTags: (_res, _err, { courseId, moduleId }) => [
        { type: 'Module', id: `LIST-${courseId}` },
        { type: 'Module', id: moduleId },
      ],
    }),

    updateLesson: build.mutation<
      Module,
      {
        courseId: string
        moduleId: string
        lessonId: string
        patch: Partial<Lesson>
      }
    >({
      query: ({ moduleId, lessonId, patch }) => ({
        url: `/api/modules/${moduleId}/lessons/${lessonId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_res, _err, { courseId, moduleId }) => [
        { type: 'Module', id: `LIST-${courseId}` },
        { type: 'Module', id: moduleId },
      ],
    }),

    deleteLesson: build.mutation<
      { success?: boolean },
      { courseId: string; moduleId: string; lessonId: string }
    >({
      query: ({ moduleId, lessonId }) => ({
        url: `/api/modules/${moduleId}/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { courseId, moduleId }) => [
        { type: 'Module', id: `LIST-${courseId}` },
        { type: 'Module', id: moduleId },
      ],
    }),
  }),
})

export const {
  useGetModulesByCourseQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = modulesApi
