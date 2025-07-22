import { Form, Row, Col } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'

import { assignments } from '../../Database'

interface Assignment {
  _id: string
  title: string
  course: string
  description: string
  points: number
  dueDate: string
  availableDate: string
  modules: string[]
}

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>()
  const assignment = assignments.find((a: Assignment) => a._id === aid)

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
  }

  if (!assignment) {
    return (
      <div className="mt-3">
        <h3>Assignment Not Found</h3>
        <Link
          to={`/Kambaz/Courses/${cid}/Assignments`}
          className="btn btn-primary"
        >
          Back to Assignments
        </Link>
      </div>
    )
  }

  return (
    <Form id="wd-assignments-editor" className="mt-3">
      <Form.Group controlId="wd-name" className="mb-4">
        <Form.Label>Assignment Name</Form.Label>
        <Form.Control defaultValue={assignment.title} />
      </Form.Group>

      <Form.Group controlId="wd-description" className="mb-4">
        <Form.Control
          as="textarea"
          rows={8}
          defaultValue={assignment.description}
        />
      </Form.Group>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Points
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            id="wd-points"
            type="number"
            defaultValue={assignment.points}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Assignment Group
        </Form.Label>
        <Col sm={9}>
          <Form.Select id="wd-group">
            <option>ASSIGNMENTS</option>
            <option>QUIZZES</option>
            <option>EXAMS</option>
            <option>PROJECT</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Display Grade as
        </Form.Label>
        <Col sm={9}>
          <Form.Select id="wd-display-grade-as" defaultValue="Percentage">
            <option>Percentage</option>
            <option>Points</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Submission Type
        </Form.Label>
        <Col sm={9}>
          <Form.Select
            id="wd-submission-type"
            defaultValue="Online"
            className="mb-3"
          >
            <option>Online</option>
            <option>On Paper</option>
          </Form.Select>
          <div className="ps-3">
            <Form.Check
              id="wd-text-entry"
              label="Text Entry"
              className="mb-1"
            />
            <Form.Check
              id="wd-website-url"
              label="Website URL"
              className="mb-1"
              defaultChecked
            />
            <Form.Check
              id="wd-media-recordings"
              label="Media Recordings"
              className="mb-1"
            />
            <Form.Check
              id="wd-student-annotation"
              label="Student Annotation"
              className="mb-1"
            />
            <Form.Check id="wd-file-upload" label="File Uploads" />
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Assign to
        </Form.Label>
        <Col sm={9}>
          <Form.Control id="wd-assign-to" defaultValue="Everyone" />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Due
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="datetime-local"
            id="wd-due-date"
            defaultValue={formatDateForInput(assignment.dueDate)}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Available from
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="datetime-local"
            id="wd-available-from"
            defaultValue={formatDateForInput(assignment.availableDate)}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Form.Label column sm={3}>
          Until
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="datetime-local"
            id="wd-available-until"
            defaultValue={formatDateForInput(assignment.dueDate)}
          />
        </Col>
      </Row>

      <hr />

      <div className="d-flex justify-content-end gap-2">
        <Link
          to={`/Kambaz/Courses/${cid}/Assignments`}
          className="btn btn-light"
        >
          Cancel
        </Link>
        <Link
          to={`/Kambaz/Courses/${cid}/Assignments`}
          className="btn btn-danger"
        >
          Save
        </Link>
      </div>
    </Form>
  )
}
