import { createSlice } from '@reduxjs/toolkit'

interface Assignment {
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

const initialState = {
  assignments: [] as Assignment[],
}

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload
    },
  },
})

export const { setAssignments } = assignmentsSlice.actions
export default assignmentsSlice.reducer
