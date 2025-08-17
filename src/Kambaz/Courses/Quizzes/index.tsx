import { forwardRef, MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, ListGroup, Row, Col, Spinner, Dropdown } from 'react-bootstrap'
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs'
import { FaBan, FaCheckCircle } from 'react-icons/fa'
import type { RootState } from '@/store'
import {
  useGetQuizzesByCourseQuery,
  useCreateQuizMutation,
  useDeleteQuizMutation,
  useTogglePublishMutation,
} from '@features/quizzes/quizzesApi'
import type { Quiz } from '@features/quizzes/types'

const KebabToggle = forwardRef<
  HTMLButtonElement,
  { onClick?: (e: any) => void }
>(({ onClick }, ref) => (
  <button
    ref={ref}
    className="btn btn-link p-0 border-0"
    onClick={(e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      onClick?.(e)
    }}
    aria-label="More actions"
  >
    <BsThreeDotsVertical className="text-muted fs-5" />
  </button>
))
KebabToggle.displayName = 'KebabToggle'

export default function QuizzesList() {
  const { cid } = useParams<{ cid: string }>()
  const navigate = useNavigate()
  const role = useSelector((s: RootState) => s.auth.currentUser?.role)
  const canManage = role === 'FACULTY' || role === 'ADMIN'

  const {
    data: quizzes = [],
    isLoading,
    isFetching,
  } = useGetQuizzesByCourseQuery(cid!, { skip: !cid })
  const [createQuiz, { isLoading: creating }] = useCreateQuizMutation()
  const [deleteQuiz, { isLoading: deleting }] = useDeleteQuizMutation()
  const [togglePublish, { isLoading: toggling }] = useTogglePublishMutation()

  const availability = (q: Quiz) => {
    const now = new Date()
    const a = q.availableDate ? new Date(q.availableDate) : null
    const u = q.availableUntil ? new Date(q.availableUntil) : null
    if (a && now < a) return `Not available until ${a.toLocaleString()}`
    if (u && now > u) return 'Closed'
    return 'Available'
  }

  const createAndEdit = async () => {
    if (!cid) return
    const { _id } = await createQuiz({
      courseId: cid,
      body: { title: 'New Quiz' },
    }).unwrap()
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${_id}/Edit`)
  }

  const handleEdit = (q: Quiz) =>
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${q._id}/Edit`)

  const handleDelete = async (q: Quiz) => {
    await deleteQuiz({ courseId: cid!, id: q._id }).unwrap()
  }

  const handleTogglePublish = async (q: Quiz) => {
    await togglePublish({ id: q._id, published: !q.published }).unwrap()
  }

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div id="wd-quizzes" className="d-flex flex-column">
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="danger"
          size="sm"
          disabled={!canManage || creating}
          onClick={createAndEdit}
        >
          {creating ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Creating…
            </>
          ) : (
            '+ Quiz'
          )}
        </Button>
      </div>

      <ListGroup className="rounded-0">
        {quizzes.length === 0 ? (
          <ListGroup.Item className="p-3 text-muted">
            No quizzes yet. {canManage ? 'Click + Quiz to create one.' : ''}
          </ListGroup.Item>
        ) : (
          quizzes.map((q) => (
            <ListGroup.Item
              key={q._id}
              className="py-3 px-3 border-0 border-bottom"
            >
              <Row className="g-0 align-items-start">
                <Col>
                  <div className="d-flex align-items-center">
                    {q.published ? (
                      <FaCheckCircle
                        className={`me-2 ${canManage ? 'text-success' : 'text-success'}`}
                        title="Published"
                        onClick={() => canManage && handleTogglePublish(q)}
                        style={{ cursor: canManage ? 'pointer' : 'default' }}
                      />
                    ) : (
                      <FaBan
                        className={`me-2 ${canManage ? 'text-danger' : 'text-danger'}`}
                        title="Unpublished"
                        onClick={() => canManage && handleTogglePublish(q)}
                        style={{ cursor: canManage ? 'pointer' : 'default' }}
                      />
                    )}
                    <a
                      href={`#/Kambaz/Courses/${cid}/Quizzes/${q._id}`}
                      className="fw-bold text-danger text-decoration-none"
                    >
                      {q.title}
                    </a>
                  </div>
                  <div className="small text-muted">
                    {availability(q)} · Due{' '}
                    {q.dueDate ? new Date(q.dueDate).toLocaleString() : '—'} ·{' '}
                    {q.points} pts · {q.questionCount ?? 0} Questions
                  </div>
                </Col>

                <Col xs="auto" className="d-flex align-items-center gap-3">
                  {canManage ? (
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as={KebabToggle}
                        id={`quiz-menu-${q._id}`}
                      />
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={(e) => {
                            e.preventDefault()
                            handleEdit(q)
                          }}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={(e) => {
                            e.preventDefault()
                            handleTogglePublish(q)
                          }}
                          disabled={toggling}
                        >
                          {q.published ? 'Unpublish' : 'Publish'}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          className="text-danger"
                          onClick={(e) => {
                            e.preventDefault()
                            handleDelete(q)
                          }}
                          disabled={deleting}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <BsThreeDots className="text-muted" />
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  )
}
