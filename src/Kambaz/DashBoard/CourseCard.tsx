import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Badge, Spinner } from 'react-bootstrap'

interface Course {
  _id: string
  name: string
  title: string
  description: string
  image: string
}

interface CourseCardProps {
  canEdit: boolean
  courseId: string
  courseName: string
  courseTitle: string
  courseDescription: string
  courseImage: string
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
  isCurrentlyEditing: boolean
  isEnrolled: boolean
  onToggleEnroll: (
    courseId: string,
    isEnrolled: boolean,
  ) => Promise<void> | void
  viewType: 'VIEW' | 'ENROLLMENT'
}

function CourseCardImpl({
  canEdit,
  courseId,
  courseName,
  courseTitle,
  courseDescription,
  courseImage,
  onEdit,
  onDelete,
  isCurrentlyEditing = false,
  isEnrolled,
  onToggleEnroll,
  viewType,
}: CourseCardProps) {
  const [busy, setBusy] = useState(false)

  const handleEdit = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    onEdit({
      _id: courseId,
      name: courseName,
      title: courseTitle,
      description: courseDescription,
      image: courseImage,
    })
  }

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${courseName}"?`)) {
      onDelete(courseId)
    }
  }

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setBusy(true)
      await onToggleEnroll(courseId, isEnrolled)
    } finally {
      setBusy(false)
    }
  }

  const cardBody = (
    <>
      <Card.Img
        variant="top"
        src={courseImage}
        alt={courseTitle}
        style={{ height: '160px', objectFit: 'cover' }}
        className="rounded-0"
        onError={(e) => {
          e.currentTarget.src = '/images/default-course.jpg'
        }}
      />
      <Card.Body className="pb-5">
        <Card.Title
          className="wd-dashboard-course-title"
          style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '.5rem' }}
        >
          {courseName}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted small">
          {courseTitle}
        </Card.Subtitle>
        <Card.Text
          className="wd-dashboard-course-description text-muted small"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4',
          }}
        >
          {courseDescription}
        </Card.Text>
      </Card.Body>
    </>
  )

  return (
    <div className="col">
      <Card
        className={`h-100 rounded-0 border wd-dashboard-course-card position-relative ${isCurrentlyEditing ? 'border-warning border-2' : ''}`}
        style={{
          transition: 'all .2s ease-in-out',
          transform: isCurrentlyEditing ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        {isCurrentlyEditing && (
          <Badge
            bg="warning"
            className="position-absolute top-0 start-0 m-2"
            style={{ zIndex: 10 }}
          >
            Editing
          </Badge>
        )}

        {viewType === 'VIEW' ? (
          <Link
            to={`/Kambaz/Courses/${courseId}/Home`}
            className="text-decoration-none text-dark"
            style={{ display: 'block' }}
          >
            {cardBody}
          </Link>
        ) : (
          <div style={{ display: 'block' }}>{cardBody}</div>
        )}

        {canEdit && viewType === 'VIEW' && (
          <div className="position-absolute bottom-0 end-0 p-2">
            <Button
              variant="outline-warning"
              size="sm"
              className="me-1"
              onClick={handleEdit}
              id={`wd-edit-course-${courseId}`}
              disabled={isCurrentlyEditing}
              title={isCurrentlyEditing ? 'Currently editing' : 'Edit course'}
            >
              ✏️
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDelete}
              id={`wd-delete-course-${courseId}`}
              title="Delete course"
            >
              🗑️
            </Button>
          </div>
        )}

        {viewType === 'ENROLLMENT' && (
          <div className="position-absolute bottom-0 end-0 p-2">
            <Button
              variant={isEnrolled ? 'danger' : 'success'}
              size="sm"
              onClick={handleToggle}
              disabled={busy}
            >
              {busy ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />{' '}
                  Processing…
                </>
              ) : isEnrolled ? (
                'Unenroll'
              ) : (
                'Enroll'
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

const CourseCard = memo(CourseCardImpl)
export default CourseCard
