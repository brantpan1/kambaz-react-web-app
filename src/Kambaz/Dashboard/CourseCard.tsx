import { memo, MouseEvent } from 'react'
import { Card } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

type Props = {
  canEdit: boolean
  courseId: string
  courseName: string
  courseTitle: string
  courseDescription: string
  courseImage: string
  viewType: 'VIEW' | 'ENROLLMENT'
  isEnrolled: boolean
  onEdit: (course: {
    _id: string
    name: string
    title: string
    description: string
    image: string
  }) => void
  onDelete: (courseId: string) => void
  onToggleEnroll: (courseId: string, isEnrolled: boolean) => void

  disableAll?: boolean
  busyEnroll?: boolean
  isEnrolling?: boolean
  busyDeleting?: boolean
  isDeleting?: boolean
  isCurrentlyEditing?: boolean
}

function CourseCardImpl(props: Props) {
  const navigate = useNavigate()
  const openUrl = `/Kambaz/Courses/${props.courseId}/Home`

  const role = useSelector((s: any) => s.auth?.currentUser?.role)
  const canDelete = role === 'FACULTY' || role === 'ADMIN'

  const deletingThis = !!props.isDeleting
  const enrollingThis = !!props.isEnrolling

  const canOpen =
    props.viewType === 'VIEW' ||
    (props.viewType === 'ENROLLMENT' && props.isEnrolled)

  const enrollDisabled =
    !!props.disableAll || !!props.busyEnroll || enrollingThis

  const deleteDisabled =
    !!props.disableAll || !!props.busyDeleting || deletingThis

  const handleCardClick = () => {
    if (canOpen) navigate(openUrl)
  }
  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <div className="col">
      <Card
        className="h-100 shadow-sm clickable-card wd-dashboard-course-card"
        onClick={handleCardClick}
        style={{ cursor: canOpen ? 'pointer' : 'default' }}
        data-testid={`course-card-${props.courseId}`}
      >
        {props.courseImage ? (
          <Link
            to={canOpen ? openUrl : '#'}
            onClick={(e) => (!canOpen ? e.preventDefault() : null)}
            aria-label={`Open ${props.courseName}`}
          >
            <Card.Img
              variant="top"
              src={props.courseImage}
              alt={props.courseTitle || props.courseName}
              style={{ objectFit: 'cover', height: 140 }}
            />
          </Link>
        ) : (
          <div
            style={{ height: 140 }}
            className="bg-light d-flex align-items-center justify-content-center text-muted"
          >
            No Image
          </div>
        )}

        <Card.Body className="d-flex flex-column">
          <div className="d-flex align-items-start mb-1">
            <Card.Title
              className="wd-dashboard-course-title"
              style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: '.5rem',
              }}
            >
              <span>{props.courseName}</span>
            </Card.Title>
          </div>

          <Card.Subtitle className="text-muted small mb-2">
            {props.courseTitle}
          </Card.Subtitle>
          <Card.Text
            className="wd-dashboard-course-description flex-grow-1 text-muted small"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4',
            }}
          >
            {props.courseDescription || '—'}
          </Card.Text>

          {props.viewType === 'ENROLLMENT' ? (
            <button
              className={`btn w-100 ${props.isEnrolled ? 'btn-danger' : 'btn-success'}`}
              disabled={enrollDisabled}
              onClick={(e) => {
                stop(e)
                props.onToggleEnroll(props.courseId, props.isEnrolled)
              }}
            >
              {enrollingThis && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
              )}
              {props.isEnrolled ? 'Unenroll' : 'Enroll'}
            </button>
          ) : (
            <div className="d-flex gap-2">
              {props.canEdit && (
                <button
                  className="btn btn-secondary flex-fill"
                  disabled={props.disableAll}
                  onClick={(e) => {
                    stop(e)
                    props.onEdit({
                      _id: props.courseId,
                      name: props.courseName,
                      title: props.courseTitle,
                      description: props.courseDescription,
                      image: props.courseImage,
                    })
                  }}
                >
                  {props.isCurrentlyEditing ? 'Editing…' : 'Edit'}
                </button>
              )}

              {canDelete && (
                <button
                  className="btn btn-danger flex-fill"
                  disabled={deleteDisabled}
                  onClick={(e) => {
                    stop(e)
                    props.onDelete(props.courseId)
                  }}
                >
                  {deletingThis && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                  )}
                  Delete
                </button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(CourseCardImpl)
