import axios from 'axios'

const axiosWithCredentials = axios.create({ withCredentials: true })
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER
const COURSES_API = `${REMOTE_SERVER}/api/courses`
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`

export const findAllUsersForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/users`
  )
  return data
}

export const getCurrentUserEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(
    `${ENROLLMENTS_API}/current`
  )
  return data
}
