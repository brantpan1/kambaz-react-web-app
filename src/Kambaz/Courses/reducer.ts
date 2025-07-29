import { createSlice } from '@reduxjs/toolkit'
import { courses as initialCourses } from '../Database'

const initialState = {
  courses: initialCourses,
  currentCourse: {
    id: '',
    name: 'New Course',
    title: 'New Course Title',
    description: 'New Course Description',
    image: '/images/reactjs.jpg',
  },
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload
    },
    addCourse: (state, action) => {
      const newCourse = {
        ...action.payload,
        id: new Date().getTime().toString(),
      }
      state.courses = [...state.courses, newCourse]
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(
        (course: any) => course.id !== action.payload,
      )
    },
    updateCourse: (state, action) => {
      state.courses = state.courses.map((course: any) =>
        course.id === action.payload.id ? action.payload : course,
      )
    },
    editCourse: (state, action) => {
      state.currentCourse = action.payload
    },
    resetCurrentCourse: (state) => {
      state.currentCourse = {
        id: '',
        name: 'New Course',
        title: 'New Course Title',
        description: 'New Course Description',
        image: '/images/reactjs.jpg',
      }
    },
  },
})

export const {
  setCourses,
  setCurrentCourse,
  addCourse,
  deleteCourse,
  updateCourse,
  editCourse,
  resetCurrentCourse,
} = coursesSlice.actions

export default coursesSlice.reducer
