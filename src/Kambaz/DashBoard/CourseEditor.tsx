import { Form, Button, Row, Col, Card } from 'react-bootstrap'

interface Course {
  id: string
  name: string
  title: string
  description: string
  image: string
}

interface CourseEditorProps {
  course: Course
  setCourse: (course: Course) => void
  onSave: () => void
  onCancel: () => void
  onFieldChange?: (field: keyof Course, value: string) => void
  isEditing: boolean
}

export default function CourseEditor({
  course,
  setCourse,
  onSave,
  onCancel,
  onFieldChange,
  isEditing,
}: CourseEditorProps) {
  const handleFieldChange = (field: keyof Course, value: string) => {
    if (onFieldChange) {
      onFieldChange(field, value)
    } else {
      setCourse({ ...course, [field]: value })
    }
  }

  return (
    <Card className="mb-4">
      <Card.Header className="text-black">
        <h5 className="mb-0">{isEditing ? 'Edit Course' : 'Add New Course'}</h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Course Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={course.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Enter course name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Course Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={course.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Enter course title"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Course Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={course.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Enter a detailed course description"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Course Image URL</Form.Label>
            <Form.Control
              type="url"
              value={course.image}
              onChange={(e) => handleFieldChange('image', e.target.value)}
              placeholder="https://example.com/course-image.jpg"
            />
            {course.image && (
              <div className="mt-2">
                <small className="text-muted">Preview:</small>
                <div className="mt-1">
                  <img
                    src={course.image}
                    alt="Course preview"
                    style={{
                      width: '100px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              onClick={onCancel}
              id="wd-cancel-course-click"
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              id={
                isEditing ? 'wd-update-course-click' : 'wd-add-new-course-click'
              }
              disabled={
                !course.name.trim() ||
                !course.title.trim() ||
                !course.description.trim()
              }
            >
              {isEditing ? 'Update Course' : 'Add Course'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}
