import { useMemo, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { Button, Spinner } from 'react-bootstrap'

import CourseCard from './courseCard'
import CourseEditor from './courseEditor'

import './DashBoard.css'

import {
  useGetAllCoursesQuery,
  useGetMyCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  type Course,
} from '@features/courses/coursesApi'

import {
  useGetMyEnrollmentsQuery,
  useEnrollInCourseMutation,
  useUnenrollFromCourseMutation,
} from '@features/enrollments/enrollmentsApi'

type ViewType = 'VIEW' | 'ENROLLMENT'

export default function Dashboard() {
  const { currentUser } = useSelector((s: RootState) => s.auth)
  const canEdit = currentUser?.role === 'FACULTY'

  const [showAll, setShowAll] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(
    null,
  )
  const [enrollingId, setEnrollingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const allCoursesQ = useGetAllCoursesQuery(undefined, { skip: !showAll })
  const myCoursesQ = useGetMyCoursesQuery(undefined, { skip: false })
  const myEnrollQ = useGetMyEnrollmentsQuery(undefined, { skip: !currentUser })

  const { data: myEnrollments = [] } = useGetMyEnrollmentsQuery(undefined, {
    skip: !currentUser,
  })

  const [createCourse, createQ] = useCreateCourseMutation()
  const [updateCourse, updateQ] = useUpdateCourseMutation()
  const [deleteCourse, deleteQ] = useDeleteCourseMutation()
  const [enroll, enrollQ] = useEnrollInCourseMutation()
  const [unenroll, unenrollQ] = useUnenrollFromCourseMutation()

  const listLoading = showAll
    ? allCoursesQ.isLoading || allCoursesQ.isFetching
    : myCoursesQ.isLoading || myCoursesQ.isFetching
  const enrollLoading = myEnrollQ.isLoading || myEnrollQ.isFetching
  const loading = listLoading || enrollLoading

  const busySaving = createQ.isLoading || updateQ.isLoading
  const busyDeleting = deleteQ.isLoading
  const busyEnroll = enrollQ.isLoading || unenrollQ.isLoading
  const disableAll = loading || busySaving || busyDeleting || busyEnroll

  const courses: Course[] = useMemo(() => {
    if (showAll) return allCoursesQ.data ?? []
    return myCoursesQ.data ?? []
  }, [showAll, allCoursesQ.data, myCoursesQ.data])

  const myCourseIdSet = useMemo(() => new Set(myEnrollments), [myEnrollments])
  const isEditing = !!editingCourse?._id
  const viewType: ViewType = showAll ? 'ENROLLMENT' : 'VIEW'

  const handleToggleEnroll = useCallback(
    async (courseId: string, isEnrolled: boolean) => {
      if (!currentUser) return
      setEnrollingId(courseId)
      try {
        if (isEnrolled) await unenroll(courseId).unwrap()
        else await enroll(courseId).unwrap()
      } catch (e) {
        console.error('Toggle enrollment failed', e)
      } finally {
        setEnrollingId(null)
      }
    },
    [currentUser, enroll, unenroll],
  )

  const handleAddNewCourse = () => {
    setEditingCourse({ name: '', title: '', description: '', image: '' })
    setShowEditor(true)
  }

  const handleEditCourse = (courseToEdit: Course) => {
    setEditingCourse(courseToEdit)
    setShowEditor(true)
  }

  const handleCourseFieldChange = (field: keyof Course, value: string) => {
    setEditingCourse((prev) => ({ ...(prev as Course), [field]: value }))
  }

  const handleSaveCourse = async () => {
    if (!editingCourse) return
    try {
      if (isEditing) {
        await updateCourse({
          id: editingCourse._id!,
          patch: editingCourse,
        }).unwrap()
      } else {
        await createCourse(editingCourse).unwrap()
      }
      setShowEditor(false)
      setEditingCourse(null)
    } catch (e) {
      console.error('Save course failed', e)
    }
  }

  const handleCancelEdit = () => {
    setShowEditor(false)
    setEditingCourse(null)
  }

  const handleDeleteCourse = async (courseId: string) => {
    setDeletingId(courseId)
    try {
      await deleteCourse(courseId).unwrap()
      if (editingCourse?._id === courseId) {
        setShowEditor(false)
        setEditingCourse(null)
      }
    } catch (e) {
      console.error('Delete course failed', e)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div id="wd-dashboard" className="d-flex flex-column">
      <div className="d-flex align-items-center">
        <h1 className="me-auto">Dashboard</h1>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAll((p) => !p)}
            id="wd-toggle-enrollment-button"
            disabled={disableAll}
          >
            {showAll ? 'Show My Courses' : 'Show All Courses'}
          </Button>
          {canEdit && !showEditor && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddNewCourse}
              disabled={disableAll}
            >
              + Add New Course
            </Button>
          )}
        </div>
      </div>

      {showEditor && editingCourse && (
        <CourseEditor
          course={editingCourse as Course}
          setCourse={(c) => setEditingCourse(c)}
          onSave={handleSaveCourse}
          onCancel={handleCancelEdit}
          onFieldChange={handleCourseFieldChange}
          isEditing={isEditing}
          saving={busySaving}
          disabled={disableAll}
        />
      )}

      <hr />
      <h2 id="wd-dashboard-published">
        {showAll ? 'All Courses' : 'My Courses'} (
        {loading ? '…' : courses.length})
      </h2>
      <hr />

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {loading ? (
          <div className="col-12">
            <div className="text-center py-5">
              <Spinner animation="border" />
              <h4 className="text-muted mt-3">Loading courses…</h4>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <h4 className="text-muted">No courses available</h4>
              <p className="text-muted">
                {canEdit
                  ? 'Click "Add New Course" to get started!'
                  : showAll
                    ? 'No courses are available at this time.'
                    : 'You are not enrolled in any courses yet.'}
              </p>
            </div>
          </div>
        ) : (
          courses.map((c) => (
            <CourseCard
              key={c._id}
              canEdit={canEdit && viewType === 'VIEW'}
              courseId={c._id}
              courseName={c.name}
              courseTitle={c.title ?? ''}
              courseDescription={c.description ?? ''}
              courseImage={c.image ?? ''}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              isCurrentlyEditing={
                !!editingCourse && editingCourse._id === c._id && showEditor
              }
              viewType={viewType}
              isEnrolled={
                showAll ? (c.enrolled ?? myCourseIdSet.has(c._id)) : true
              }
              onToggleEnroll={handleToggleEnroll}
              disableAll={disableAll}
              busyEnroll={busyEnroll}
              isEnrolling={enrollingId === c._id}
              busyDeleting={busyDeleting}
              isDeleting={deletingId === c._id}
            />
          ))
        )}
      </div>
    </div>
  )
}
