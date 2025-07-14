import { Form, Row, Col, Button } from 'react-bootstrap'

export default function AssignmentEditor() {
  return (
    <Form id="wd-assignments-editor" className="mt-3">
      <Form.Group controlId="wd-name" className="mb-4">
        <Form.Label>Assignment Name</Form.Label>
        <Form.Control defaultValue="A1 - ENV + HTML" />
      </Form.Group>

      <Form.Group controlId="wd-description" className="mb-4">
        <Form.Control as="textarea" rows={8} />
      </Form.Group>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Points
        </Form.Label>
        <Col sm={9}>
          <Form.Control id="wd-points" type="number" />
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
          <Form.Control id="wd-assign-to" />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Due
        </Form.Label>
        <Col sm={9}>
          <Form.Control type="datetime-local" id="wd-due-date" />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3}>
          Available from
        </Form.Label>
        <Col sm={9}>
          <Form.Control type="datetime-local" id="wd-available-from" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Form.Label column sm={3}>
          Until
        </Form.Label>
        <Col sm={9}>
          <Form.Control type="datetime-local" id="wd-available-until" />
        </Col>
      </Row>

      <hr />

      <div className="d-flex justify-content-end gap-2">
        <Button variant="light">Cancel</Button>
        <Button variant="danger">Save</Button>
      </div>
    </Form>
  )
}
