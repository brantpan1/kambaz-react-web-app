import { createSlice } from '@reduxjs/toolkit'

type Lesson = {
  _id: string
  name: string
  description: string
  module: string
}

type Module = {
  _id: string
  name: string
  description: string
  course: string
  lessons?: Lesson[]
  editing?: boolean
}

const initialState: { modules: Module[] } = { modules: [] }

const modulesSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    setModules: (state, action) => {
      state.modules = action.payload as Module[]
    },
    setModuleEditing: (state, { payload: moduleId }: { payload: string }) => {
      state.modules = state.modules.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : { ...m, editing: false },
      )
    },
    updateModuleLocal: (state, { payload: module }: { payload: Module }) => {
      state.modules = state.modules.map((m) =>
        m._id === module._id ? module : m,
      )
    },
  },
})

export const { setModules, setModuleEditing, updateModuleLocal } =
  modulesSlice.actions
export default modulesSlice.reducer
