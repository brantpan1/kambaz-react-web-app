import axios from 'axios'

const axiosWithCredentials = axios.create({ withCredentials: true })
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER
const COURSES_API = `${REMOTE_SERVER}/api/courses`

export const fetchAllCourses = async () => {
  const { data } = await axiosWithCredentials.get(COURSES_API)
  return data
}

export const fetchEnrolledCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}/enrolled`)
  return data
}

export const deleteCourse = async (id: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`)
  return data
}

export const updateCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${course._id}`, 
    course
  )
  return data
}

export const enrollInCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/enroll`
  )
  return data
}

export const unenrollFromCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${COURSES_API}/${courseId}/enroll`
  )
  return data
}
