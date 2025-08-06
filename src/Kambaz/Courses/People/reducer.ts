import { createSlice } from '@reduxjs/toolkit'

interface Enrollment {
  _id: string
  user: string
  course: string
}

const initialState = {
  enrollments: [] as Enrollment[],
}

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      state.enrollments = action.payload
    },
    addEnrollment: (state, action) => {
      state.enrollments.push(action.payload)
    },
    removeEnrollment: (state, action) => {
      const { user, course } = action.payload
      state.enrollments = state.enrollments.filter(
        (e) => !(e.user === user && e.course === course),
      )
    },
  },
})

export const { setEnrollments, addEnrollment, removeEnrollment } =
  enrollmentsSlice.actions
export default enrollmentsSlice.reducer
