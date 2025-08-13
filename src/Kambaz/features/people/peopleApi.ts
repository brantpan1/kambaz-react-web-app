import { api } from '@services/api'

export interface Person {
  _id: string
  firstName: string
  lastName: string
  loginId: string
  section: string
  role: string
  lastActivity: string
  totalActivity: string
}

export const peopleApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPeopleByCourse: build.query<Person[], string>({
      query: (cid) => ({ url: `/api/courses/${cid}/users` }),
      providesTags: (result, _err, cid) =>
        result
          ? [
              { type: 'Person' as const, id: `LIST-${cid}` },
              ...result.map((p) => ({ type: 'Person' as const, id: p._id })),
            ]
          : [{ type: 'Person' as const, id: `LIST-${cid}` }],
    }),
  }),
})

export const { useGetPeopleByCourseQuery } = peopleApi
