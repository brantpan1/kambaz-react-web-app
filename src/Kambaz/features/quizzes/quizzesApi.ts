import { api } from '@services/api'
import type { Quiz, Question, Attempt } from './types'

export const quizzesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getQuizzesByCourse: build.query<Quiz[], string>({
      query: (cid) => ({ url: `/api/courses/${cid}/quizzes` }),
      providesTags: (res, _e, cid) =>
        res
          ? [
              { type: 'Quiz' as const, id: `LIST-${cid}` },
              ...res.map((q) => ({ type: 'Quiz' as const, id: q._id })),
            ]
          : [{ type: 'Quiz' as const, id: `LIST-${cid}` }],
    }),
    getQuizById: build.query<Quiz, string>({
      query: (qid) => ({ url: `/api/quizzes/${qid}` }),
      providesTags: (_r, _e, qid) => [{ type: 'Quiz', id: qid }],
    }),
    createQuiz: build.mutation<
      Quiz,
      { courseId: string; body?: Partial<Quiz> }
    >({
      query: ({ courseId, body }) => ({
        url: `/api/courses/${courseId}/quizzes`,
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: (_r, _e, { courseId }) => [
        { type: 'Quiz', id: `LIST-${courseId}` },
      ],
    }),
    updateQuiz: build.mutation<Quiz, { id: string; patch: Partial<Quiz> }>({
      query: ({ id, patch }) => ({
        url: `/api/quizzes/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Quiz', id }],
    }),
    deleteQuiz: build.mutation<
      { success?: boolean },
      { courseId: string; id: string }
    >({
      query: ({ id }) => ({ url: `/api/quizzes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, { courseId, id }) => [
        { type: 'Quiz', id },
        { type: 'Quiz', id: `LIST-${courseId}` },
      ],
    }),
    togglePublish: build.mutation<Quiz, { id: string; published: boolean }>({
      query: ({ id, published }) => ({
        url: `/api/quizzes/${id}/publish`,
        method: 'POST',
        body: { published },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Quiz', id }],
    }),

    getQuestionsByQuiz: build.query<Question[], string>({
      query: (qid) => ({ url: `/api/quizzes/${qid}/questions` }),
      providesTags: (res, _e, qid) =>
        res
          ? [
              { type: 'Question' as const, id: `LIST-${qid}` },
              ...res.map((q) => ({ type: 'Question' as const, id: q._id })),
            ]
          : [{ type: 'Question' as const, id: `LIST-${qid}` }],
    }),
    createQuestion: build.mutation<
      Question,
      { quizId: string; body: Partial<Question> }
    >({
      query: ({ quizId, body }) => ({
        url: `/api/quizzes/${quizId}/questions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { quizId }) => [
        { type: 'Question', id: `LIST-${quizId}` },
        { type: 'Quiz', id: quizId },
      ],
    }),
    updateQuestion: build.mutation<
      Question,
      { id: string; patch: Partial<Question> }
    >({
      query: ({ id, patch }) => ({
        url: `/api/questions/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Question', id }],
    }),
    deleteQuestion: build.mutation<
      { success?: boolean },
      { quizId: string; id: string }
    >({
      query: ({ id }) => ({ url: `/api/questions/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, { quizId, id }) => [
        { type: 'Question', id },
        { type: 'Question', id: `LIST-${quizId}` },
        { type: 'Quiz', id: quizId },
      ],
    }),
    startAttempt: build.mutation<{ attemptId: string }, string>({
      query: (qid) => ({ url: `/api/quizzes/${qid}/attempts`, method: 'POST' }),
    }),
    submitAttempt: build.mutation<
      { score: number },
      { quizId: string; attemptId: string; answers: any[] }
    >({
      query: ({ attemptId, answers }) => ({
        url: `/api/attempts/${attemptId}/submit`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: (_res, _err, { quizId }) => [
        { type: 'Attempt', id: `LAST-${quizId}` },
        { type: 'Attempt', id: `LIST-${quizId}` },
      ],
    }),
    getMyAttempts: build.query<Attempt[], string>({
      query: (quizId) => ({ url: `/api/quizzes/${quizId}/attempts` }),
      providesTags: (_res, _err, quizId) => [
        { type: 'Attempt', id: `LIST-${quizId}` },
      ],
    }),
    getAttemptById: build.query<Attempt, string>({
      query: (attemptId) => ({ url: `/api/attempts/${attemptId}` }),
      providesTags: (_r, _e, id) => [{ type: 'Attempt' as const, id }],
    }),
  }),
})

export const {
  useGetQuizzesByCourseQuery,
  useGetQuizByIdQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useTogglePublishMutation,
  useGetQuestionsByQuizQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useStartAttemptMutation,
  useSubmitAttemptMutation,
  useGetMyAttemptsQuery,
  useGetAttemptByIdQuery,
} = quizzesApi
