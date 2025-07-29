import { createSlice } from '@reduxjs/toolkit'
import { assignments } from '../../Database'
import { v4 as uuidv4 } from 'uuid'

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
  assignments: assignments as Assignment[],
}

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, { payload: assignment }) => {
      const newAssignment: Assignment = {
        _id: uuidv4(),
        title: assignment.title,
        course: assignment.course,
        description: assignment.description || '',
        points: assignment.points || 100,
        dueDate: assignment.dueDate,
        availableDate: assignment.availableDate,
        availableUntil: assignment.availableUntil || assignment.dueDate,
        modules: assignment.modules || ['Multiple Modules'],
      }
      state.assignments = [...state.assignments, newAssignment]
    },
    deleteAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== assignmentId,
      )
    },
    updateAssignment: (state, { payload: assignment }) => {
      state.assignments = state.assignments.map((a) =>
        a._id === assignment._id ? assignment : a,
      )
    },
  },
})

export const { addAssignment, deleteAssignment, updateAssignment } =
  assignmentsSlice.actions
export default assignmentsSlice.reducer
