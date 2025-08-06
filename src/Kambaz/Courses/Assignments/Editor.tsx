import { useState, useEffect } from 'react'
import { Form, Row, Col, Spinner } from 'react-bootstrap' // ⬅️ add Spinner
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as client from './client'

interface Assignment {
  _id: string
  title: string
  course: string
  description: string
  points: number
  dueDate: string
  availableDate: string
  availableUntil?: string
  modules: string[]
}

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [assignment, setAssignment] = useState<Assignment | null>(null)

  const isNewAssignment = aid === 'new'

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  const [formData, setFormData] = useState({
    title: 'New Assignment',
    description: '',
    points: 100,
    dueDate: new Date().toISOString(),
    availableDate: new Date().toISOString(),
    availableUntil: new Date().toISOString(),
  })

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!isNewAssignment && aid) {
        setLoading(true)
        try {
          const fetchedAssignment = await client.findAssignmentById(aid)
          setAssignment(fetchedAssignment)
          setFormData({
            title: fetchedAssignment.title,
            description: fetchedAssignment.description,
            points: fetchedAssignment.points,
            dueDate: fetchedAssignment.dueDate,
            availableDate: fetchedAssignment.availableDate,
            availableUntil:
              fetchedAssignment.availableUntil || fetchedAssignment.dueDate,
          })
        } catch (error) {
          console.error('Error fetching assignment:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchAssignment()
  }, [aid, isNewAssignment])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (isNewAssignment) {
        await client.createAssignment(cid!, {
          ...formData,
          modules: ['Multiple Modules'],
        })
      } else {
        await client.updateAssignment({
          _id: aid,
          ...assignment,
          ...formData,
        })
      }
      navigate(`/Kambaz/Courses/${cid}/Assignments`)
    } catch (error) {
      console.error('Error saving assignment:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Loading assignment...</h4>
      </div>
    )
  }

  if (!isNewAssignment && !assignment && !loading) {
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
      <fieldset disabled={saving}>
        <Form.Group controlId="wd-name" className="mb-4">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="wd-description" className="mb-4">
          <Form.Control
            as="textarea"
            rows={8}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter assignment description..."
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
              value={formData.points}
              onChange={(e) =>
                handleInputChange('points', parseInt(e.target.value) || 0)
              }
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Assignment Group
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-group" defaultValue="ASSIGNMENTS">
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
              value={formatDateForInput(formData.dueDate)}
              onChange={(e) =>
                handleInputChange(
                  'dueDate',
                  new Date(e.target.value).toISOString(),
                )
              }
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
              value={formatDateForInput(formData.availableDate)}
              onChange={(e) =>
                handleInputChange(
                  'availableDate',
                  new Date(e.target.value).toISOString(),
                )
              }
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
              value={formatDateForInput(
                formData.availableUntil || formData.dueDate,
              )}
              onChange={(e) =>
                handleInputChange(
                  'availableUntil',
                  new Date(e.target.value).toISOString(),
                )
              }
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
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving…
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </fieldset>
    </Form>
  )
}
