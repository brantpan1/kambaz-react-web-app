import { Form, Row, Col } from 'react-bootstrap'
import type { Course } from '@features/courses/coursesApi'

type Props = {
  course: Course
  setCourse?: (c: Course) => void
  onFieldChange: (field: keyof Course, value: string) => void
  onSave: () => void
  onCancel: () => void
  isEditing: boolean
  saving?: boolean
  disabled?: boolean
}

export default function CourseEditor({
  course,
  setCourse,
  onFieldChange,
  onSave,
  onCancel,
  isEditing,
  saving = false,
  disabled = false,
}: Props) {
  const setField = (field: keyof Course) => (value: string) => {
    onFieldChange?.(field, value)
    if (setCourse) {
      setCourse({ ...course, [field]: value } as Course)
    }
  }

  const showImage = !!course.image

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex align-items-center">
        <h5 className="mb-0">{isEditing ? 'Edit Course' : 'Create Course'}</h5>
      </div>

      <div className="card-body">
        <fieldset disabled={disabled}>
          <Row className="g-3">
            <Col md={showImage ? 8 : 12}>
              <Form.Group controlId="wd-course-name">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  placeholder="e.g., CS4550"
                  value={course.name || ''}
                  onChange={(e) => setField('name')(e.target.value)}
                />
              </Form.Group>
            </Col>

            {showImage && (
              <Col md={4} className="d-none d-md-block">
                <div className="border rounded overflow-hidden">
                  <img
                    src={course.image!}
                    alt={course.title || course.name || 'Course image'}
                    style={{ width: '100%', height: 120, objectFit: 'cover' }}
                  />
                </div>
              </Col>
            )}

            <Col md={12}>
              <Form.Group controlId="wd-course-title" className="mt-2">
                <Form.Label>Course Title</Form.Label>
                <Form.Control
                  placeholder="e.g., Web Development"
                  value={course.title || ''}
                  onChange={(e) => setField('title')(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="wd-course-description" className="mt-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Short description of the course..."
                  value={course.description || ''}
                  onChange={(e) => setField('description')(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="wd-course-image" className="mt-2">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  placeholder="https://…"
                  value={course.image || ''}
                  onChange={(e) => setField('image')(e.target.value)}
                />
                <div className="form-text">
                  Paste a public image URL to show a banner on the course card.
                </div>
              </Form.Group>
            </Col>
          </Row>
        </fieldset>
      </div>

      <div className="card-footer d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-light"
          onClick={onCancel}
          disabled={saving || disabled}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onSave}
          disabled={saving || disabled}
        >
          {saving && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
          )}
          {isEditing ? 'Save Changes' : 'Create Course'}
        </button>
      </div>
    </div>
  )
}
