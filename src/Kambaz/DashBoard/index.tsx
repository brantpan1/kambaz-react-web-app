import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import CourseCard from './CourseCard'
import CourseEditor from './CourseEditor'
import {
  addCourse,
  deleteCourse,
  updateCourse,
  editCourse,
  setCurrentCourse,
  resetCurrentCourse,
} from '../Courses/reducer'
import { enroll, unenroll } from '../Courses/People/reducer'
import './DashBoard.css'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { courses, currentCourse } = useSelector(
    (state: any) => state.coursesReducer,
  )
  const { currentUser } = useSelector((state: any) => state.accountReducer)
  const enrollments = useSelector((state: any) => state.enrollmentsReducer)

  const [showEditor, setShowEditor] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const isEnrolled = (cid: string) =>
    currentUser &&
    enrollments.some((e: any) => e.user === currentUser._id && e.course === cid)

  const handleToggleEnroll = (cid: string, enrolled: boolean) => {
    if (!currentUser) return
    const payload = { user: currentUser._id, course: cid }
    dispatch(enrolled ? unenroll(payload) : enroll(payload))
  }

  const myCourses = courses.filter((c: any) => isEnrolled(c.id))
  const list = showAll ? courses : myCourses
  const isEditing = currentCourse.id !== ''

  const handleAddNewCourse = () => {
    dispatch(resetCurrentCourse())
    setShowEditor(true)
  }

  const handleEditCourse = (courseToEdit: any) => {
    dispatch(editCourse(courseToEdit))
    setShowEditor(true)
  }

  const handleSaveCourse = () => {
    if (isEditing) {
      dispatch(updateCourse(currentCourse))
    } else {
      dispatch(addCourse(currentCourse))
    }
    setShowEditor(false)
    dispatch(resetCurrentCourse())
  }

  const handleCancelEdit = () => {
    dispatch(resetCurrentCourse())
    setShowEditor(false)
  }

  const handleDeleteCourse = (courseId: string) => {
    if (currentCourse.id === courseId) {
      setShowEditor(false)
      dispatch(resetCurrentCourse())
    }
    dispatch(deleteCourse(courseId))
  }

  const handleCourseFieldChange = (field: string, value: string) => {
    dispatch(
      setCurrentCourse({
        ...currentCourse,
        [field]: value,
      }),
    )
  }

  return (
    <div id="wd-dashboard" className="d-flex flex-column">
      <div className="d-flex align-items-center">
        <h1 className="me-auto">Dashboard</h1>
        <div className="d-flex  gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAll((p) => !p)}
            id="wd-toggle-enrollment-button"
          >
            {showAll ? 'Show My Courses' : 'Show All Courses'}
          </Button>
          {currentUser?.role === 'FACULTY' && !showEditor && (
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
      <h2 id="wd-dashboard-published">Published Courses ({list.length})</h2>
      <hr />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {list.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <h4 className="text-muted">No courses available</h4>
              <p className="text-muted">
                {currentUser?.role === 'FACULTY'
                  ? 'Click "Add New Course" to get started!'
                  : 'You are not enrolled in any courses yet.'}
              </p>
            </div>
          </div>
        ) : (
          list.map((c: any) => (
            <CourseCard
              key={c.id}
              courseId={c.id}
              courseName={c.name}
              courseTitle={c.title}
              courseDescription={c.description}
              courseImage={c.image}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              isCurrentlyEditing={currentCourse.id === c.id && showEditor}
              isEnrolled={isEnrolled(c.id)}
              onToggleEnroll={handleToggleEnroll}
              viewType={showAll ? 'ENROLLMENT' : 'VIEW'}
            />
          ))
        )}
      </div>
    </div>
  )
}
