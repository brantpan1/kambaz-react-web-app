import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  ListGroup,
  Modal,
} from 'react-bootstrap'
import {
  BsGripVertical,
  BsThreeDotsVertical,
  BsThreeDots,
} from 'react-icons/bs'
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai'
import { FiFileText } from 'react-icons/fi'
import { FaRegCheckCircle, FaTrash, FaPen } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

import {
  useGetAssignmentsByCourseQuery,
  useDeleteAssignmentMutation,
  type Assignment,
} from '@features/assignments/assignmentsApi'

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(
    null,
  )

  const role = useSelector((s: RootState) => s.auth.currentUser?.role)
  const canManage = role === 'FACULTY' || role === 'ADMIN'

  const {
    data: assignments = [],
    isLoading,
    isFetching,
    isError,
  } = useGetAssignmentsByCourseQuery(cid!, { skip: !cid })

  const [deleteAssignment] = useDeleteAssignmentMutation()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getAvailabilityText = (availableDate: string) => {
    const now = new Date()
    const available = new Date(availableDate)
    return now >= available
      ? `Available since ${formatDate(availableDate)}`
      : `Not available until ${formatDate(availableDate)}`
  }

  const handleDeleteClick = (id: string) => {
    setAssignmentToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (assignmentToDelete && cid) {
      try {
        await deleteAssignment({
          courseId: cid,
          id: assignmentToDelete,
        }).unwrap()
      } catch (e) {
        console.error('Error deleting assignment:', e)
      }
    }
    setShowDeleteModal(false)
    setAssignmentToDelete(null)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setAssignmentToDelete(null)
  }

  const totalPoints = assignments.reduce(
    (sum: number, a: Assignment) => sum + (a.points || 0),
    0,
  )

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Loading assignments...</h4>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-5 text-danger">
        Failed to load assignments.
      </div>
    )
  }

  return (
    <div id="wd-assignments" className="d-flex flex-column">
      <Row className="mb-3">
        <Col lg={4} md={6}>
          <InputGroup size="sm">
            <InputGroup.Text id="wd-search-icon">
              <AiOutlineSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search Assignments"
              aria-describedby="wd-search-icon"
              id="wd-search-assignment"
            />
          </InputGroup>
        </Col>
        <Col className="d-flex justify-content-end gap-2">
          <Button
            variant="light"
            size="sm"
            className="d-flex align-items-center"
          >
            <AiOutlinePlus className="me-1" /> Group
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="d-flex align-items-center"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/new`)}
          >
            <AiOutlinePlus className="me-1" /> Assignment
          </Button>
        </Col>
      </Row>

      <ListGroup className="rounded-0">
        {assignments.length > 0 ? (
          <ListGroup.Item className="p-0 mb-4">
            <div className="d-flex align-items-center bg-light px-3 py-2 border-bottom">
              <BsGripVertical className="me-2 text-muted" />
              <span className="fw-bold">ASSIGNMENTS</span>
              <span className="ms-auto d-flex align-items-center">
                <Button
                  variant="light"
                  size="sm"
                  className="py-0 px-2 me-2 border"
                >
                  {totalPoints} pts total
                </Button>
                <BsThreeDotsVertical className="text-muted" />
              </span>
            </div>

            <ListGroup className="rounded-0 border-start border-4 border-success">
              {assignments.map((assignment) => (
                <ListGroup.Item
                  key={assignment._id}
                  className="py-3 ps-2 pe-0 border-0 border-bottom"
                >
                  <Row className="g-0 align-items-start">
                    <Col xs="auto" className="d-flex align-items-center pe-2">
                      <BsGripVertical className="text-muted me-2" />
                      <FiFileText className="text-success" />
                    </Col>

                    <Col>
                      <a
                        href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                        className="fw-bold text-danger text-decoration-none"
                      >
                        {assignment.title}
                      </a>
                      <div className="small text-muted">
                        {assignment.modules?.join(', ') || '—'} |{' '}
                        {getAvailabilityText(assignment.availableDate)} | Due{' '}
                        {formatDate(assignment.dueDate)} | {assignment.points}{' '}
                        pts
                      </div>
                    </Col>

                    <Col
                      xs="auto"
                      className="d-flex align-items-center justify-content-end pe-3"
                    >
                      {canManage && (
                        <FaPen
                          className="text-secondary me-3"
                          style={{ cursor: 'pointer' }}
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/Kambaz/Courses/${cid}/Assignments/${assignment._id}`,
                            )
                          }
                        />
                      )}
                      {canManage && (
                        <FaTrash
                          className="text-danger me-3"
                          style={{ cursor: 'pointer' }}
                          title="Delete"
                          onClick={() => handleDeleteClick(assignment._id)}
                        />
                      )}
                      <FaRegCheckCircle className="text-success me-3" />
                      <BsThreeDots className="text-muted" />
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ListGroup.Item>
        ) : (
          <ListGroup.Item className="p-3 text-center text-muted">
            No assignments available for this course.
          </ListGroup.Item>
        )}
      </ListGroup>

      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
