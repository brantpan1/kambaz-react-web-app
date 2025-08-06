import { useState, useEffect, useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import CourseCard from './CourseCard'
import CourseEditor from './CourseEditor'
import {
  setCourses,
  setCurrentCourse,
  resetCurrentCourse,
} from '../Courses/reducer'
import * as userClient from '../Account/client'
import * as courseClient from '../Courses/client'
import './DashBoard.css'

function equalCourses(a: any[], b: any[]) {
  if (a === b) return true
  if (!a || !b || a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const A = a[i],
      B = b[i]
    if (A._id !== B._id || A.enrolled !== B.enrolled) return false
  }
  return true
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const { courses, currentCourse } = useSelector(
    (s: any) => s.coursesReducer,
    shallowEqual,
  )
  const { currentUser } = useSelector(
    (s: any) => s.accountReducer,
    shallowEqual,
  )

  const [showEditor, setShowEditor] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(false)

  const isEditing = !!currentCourse?._id
  const canEdit = currentUser?.role === 'FACULTY'

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      if (!currentUser) {
        dispatch(setCourses([]))
        return
      }
      const fetched = showAll
        ? await courseClient.fetchAllCourses()
        : await courseClient.fetchEnrolledCourses()

      if (!equalCourses(fetched, courses)) {
        dispatch(setCourses(fetched))
      }
    } catch (e) {
      console.error('Error fetching courses:', e)
      dispatch(setCourses([]))
    } finally {
      setLoading(false)
    }
  }, [currentUser, showAll, dispatch, courses])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleToggleEnroll = useCallback(
    async (courseId: string, isEnrolled: boolean) => {
      if (!currentUser) return
      if (isEnrolled) {
        await courseClient.unenrollFromCourse(courseId)
      } else {
        await courseClient.enrollInCourse(courseId)
      }
      await fetchCourses()
    },
    [currentUser, fetchCourses],
  )

  const handleAddNewCourse = useCallback(() => {
    dispatch(resetCurrentCourse())
    setShowEditor(true)
  }, [dispatch])

  const handleEditCourse = useCallback(
    (courseToEdit: any) => {
      dispatch(setCurrentCourse(courseToEdit))
      setShowEditor(true)
    },
    [dispatch],
  )

  const handleSaveCourse = useCallback(async () => {
    try {
      if (isEditing) {
        await courseClient.updateCourse(currentCourse)
      } else {
        await userClient.createCourse(currentCourse)
      }
      await fetchCourses()
      setShowEditor(false)
      dispatch(resetCurrentCourse())
    } catch (e) {
      console.error('Error saving course:', e)
    }
  }, [isEditing, currentCourse, fetchCourses, dispatch])

  const handleCancelEdit = useCallback(() => {
    dispatch(resetCurrentCourse())
    setShowEditor(false)
  }, [dispatch])

  const handleDeleteCourse = useCallback(
    async (courseId: string) => {
      try {
        await courseClient.deleteCourse(courseId)
        await fetchCourses()
        if (currentCourse._id === courseId) {
          setShowEditor(false)
          dispatch(resetCurrentCourse())
        }
      } catch (e) {
        console.error('Error deleting course:', e)
      }
    },
    [currentCourse?._id, fetchCourses, dispatch],
  )

  const handleCourseFieldChange = useCallback(
    (field: string, value: string) => {
      dispatch(setCurrentCourse({ ...currentCourse, [field]: value }))
    },
    [currentCourse, dispatch],
  )

  const viewType: 'VIEW' | 'ENROLLMENT' = showAll ? 'ENROLLMENT' : 'VIEW'

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
            disabled={loading}
          >
            {showAll ? 'Show My Courses' : 'Show All Courses'}
          </Button>
          {canEdit && !showEditor && (
            <Button variant="primary" size="lg" onClick={handleAddNewCourse}>
              + Add New Course
            </Button>
          )}
        </div>
      </div>

      {showEditor && (
        <CourseEditor
          course={currentCourse}
          setCourse={(course) => dispatch(setCurrentCourse(course))}
          onSave={handleSaveCourse}
          onCancel={handleCancelEdit}
          onFieldChange={handleCourseFieldChange}
          isEditing={isEditing}
        />
      )}

      <hr />
      <h2 id="wd-dashboard-published">
        Published Courses ({loading ? '...' : courses.length})
      </h2>
      <hr />

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {loading ? (
          <div className="col-12">
            <div className="text-center py-5">
              <h4 className="text-muted">Loading courses...</h4>
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
          courses.map((c: any) => (
            <CourseCard
              key={c._id}
              canEdit={canEdit}
              courseId={c._id}
              courseName={c.name}
              courseTitle={c.title}
              courseDescription={c.description}
              courseImage={c.image}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              isCurrentlyEditing={currentCourse._id === c._id && showEditor}
              isEnrolled={c.enrolled}
              onToggleEnroll={handleToggleEnroll}
              viewType={viewType}
            />
          ))
        )}
      </div>
    </div>
  )
}
