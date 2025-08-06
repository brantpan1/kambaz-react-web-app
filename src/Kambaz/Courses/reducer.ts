import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  courses: [],
  currentCourse: {
    _id: '',
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
    resetCurrentCourse: (state) => {
      state.currentCourse = initialState.currentCourse
    },
  },
})

export const { setCourses, setCurrentCourse, resetCurrentCourse } =
  coursesSlice.actions

export default coursesSlice.reducer
