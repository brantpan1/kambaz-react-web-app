import axios from 'axios'

const axiosWithCredentials = axios.create({ withCredentials: true })
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER
const COURSES_API = `${REMOTE_SERVER}/api/courses`
const MODULES_API = `${REMOTE_SERVER}/api/modules`

export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/modules`
  )
  return data
}

export const createModule = async (courseId: string, module: any) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  )
  return data
}

export const updateModule = async (module: any) => {
  const { data } = await axiosWithCredentials.put(
    `${MODULES_API}/${module._id}`,
    module
  )
  return data
}

export const deleteModule = async (moduleId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${MODULES_API}/${moduleId}`
  )
  return data
}
