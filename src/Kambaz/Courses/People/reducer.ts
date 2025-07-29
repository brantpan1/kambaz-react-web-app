import { createSlice } from '@reduxjs/toolkit'
import { enrollment } from '../../Database/'
import { v4 as uuidv4 } from 'uuid'

interface Enrollment {
  _id: string
  user: string
  course: string
}

const slice = createSlice({
  name: 'enrollments',
  initialState: enrollment as Enrollment[],
  reducers: {
    enroll(state, { payload }) {
      state.push({ _id: uuidv4(), ...payload })
    },
    unenroll(state, { payload }) {
      const i = state.findIndex(
        (e) => e.user === payload.user && e.course === payload.course,
      )
      if (i !== -1) state.splice(i, 1)
    },
  },
})

export const { enroll, unenroll } = slice.actions
export default slice.reducer
