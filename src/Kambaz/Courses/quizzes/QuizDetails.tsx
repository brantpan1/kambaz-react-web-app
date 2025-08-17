import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import {
  Button,
  Spinner,
  Row,
  Col,
  Badge,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import { FaBan, FaCheckCircle } from 'react-icons/fa'
import {
  useGetQuizByIdQuery,
  useTogglePublishMutation,
  useGetMyAttemptsQuery,
} from '@features/quizzes/quizzesApi'
import type { Quiz } from '@features/quizzes/types'

function formatDateTime(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString()
}

function availabilityText(q: Quiz) {
  const now = new Date()
  const a = q.availableDate ? new Date(q.availableDate) : undefined
  const u = q.availableUntil ? new Date(q.availableUntil) : undefined
  if (a && now < a)
    return {
      label: `Not available until ${formatDateTime(q.availableDate)}`,
      state: 'notyet' as const,
    }
  if (u && now > u) return { label: 'Closed', state: 'closed' as const }
  return { label: 'Available', state: 'open' as const }
}

export default function QuizDetails() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>()
  const navigate = useNavigate()
  const role = useSelector((s: RootState) => s.auth.currentUser?.role)
  const isFaculty = role === 'FACULTY' || role === 'ADMIN'

  const {
    data: quiz,
    isLoading,
    isFetching,
    isError,
  } = useGetQuizByIdQuery(qid!, { skip: !qid })
  const { data: attempts = [], isLoading: aLoading } = useGetMyAttemptsQuery(
    qid!,
    {
      skip: !qid,
      refetchOnMountOrArgChange: true,
    },
  )
  const [togglePublish, { isLoading: toggling }] = useTogglePublishMutation()

  const avail = useMemo(
    () =>
      quiz ? availabilityText(quiz) : { label: '', state: 'open' as const },
    [quiz],
  )

  const canStart = useMemo(() => {
    if (!quiz) return false
    if (!quiz.published) return false
    return avail.state === 'open'
  }, [quiz, avail.state])

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    )
  }

  if (isError || !quiz) {
    return (
      <div className="mt-3">
        <h4 className="text-danger">Quiz not found</h4>
        <Link
          to={`/Kambaz/Courses/${cid}/Quizzes`}
          className="btn btn-primary mt-2"
        >
          Back to Quizzes
        </Link>
      </div>
    )
  }

  return (
    <div id="wd-quiz-details" className="mt-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          {quiz.published ? (
            <FaCheckCircle className="text-success" title="Published" />
          ) : (
            <FaBan className="text-danger" title="Unpublished" />
          )}
          <h3 className="m-0">{quiz.title}</h3>
          <Badge bg={quiz.published ? 'success' : 'secondary'}>
            {quiz.published ? 'Published' : 'Unpublished'}
          </Badge>
        </div>

        <div className="d-flex gap-2">
          {isFaculty ? (
            <>
              <Button
                variant={quiz.published ? 'outline-secondary' : 'success'}
                disabled={toggling}
                onClick={() =>
                  togglePublish({ id: quiz._id, published: !quiz.published })
                }
              >
                {quiz.published ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="outline-primary"
                onClick={() =>
                  navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Preview`)
                }
              >
                Preview
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Edit`)
                }
              >
                Edit
              </Button>
            </>
          ) : (
            <OverlayTrigger
              placement="bottom"
              overlay={
                !canStart ? (
                  <Tooltip>
                    {quiz.published ? avail.label : 'This quiz is unpublished'}
                  </Tooltip>
                ) : (
                  <></>
                )
              }
            >
              <span>
                <Button
                  variant="danger"
                  disabled={!canStart}
                  onClick={() =>
                    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Take`)
                  }
                >
                  Start Quiz
                </Button>
              </span>
            </OverlayTrigger>
          )}
        </div>
      </div>

      {quiz.description && (
        <div className="mb-4">
          <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
        </div>
      )}

      <Row className="gy-3">
        <Col md={6}>
          <h5 className="mb-3">Summary</h5>
          <dl className="row mb-0">
            <dt className="col-6">Quiz Type</dt>
            <dd className="col-6">
              {quiz.type?.replace(/_/g, ' ') || 'GRADED QUIZ'}
            </dd>

            <dt className="col-6">Points</dt>
            <dd className="col-6">{quiz.points ?? 0}</dd>

            <dt className="col-6">Assignment Group</dt>
            <dd className="col-6">{quiz.assignmentGroup || 'QUIZZES'}</dd>

            <dt className="col-6">Questions</dt>
            <dd className="col-6">{quiz.questionCount ?? 0}</dd>

            <dt className="col-6">Availability</dt>
            <dd className="col-6">{avail.label}</dd>

            <dt className="col-6">Due</dt>
            <dd className="col-6">{formatDateTime(quiz.dueDate)}</dd>

            <dt className="col-6">Available from</dt>
            <dd className="col-6">{formatDateTime(quiz.availableDate)}</dd>

            <dt className="col-6">Until</dt>
            <dd className="col-6">{formatDateTime(quiz.availableUntil)}</dd>
          </dl>
        </Col>

        <Col md={6}>
          <h5 className="mb-3">Options</h5>
          <dl className="row mb-0">
            <dt className="col-8">Shuffle Answers</dt>
            <dd className="col-4">
              {quiz.settings?.shuffleAnswers ? 'Yes' : 'No'}
            </dd>

            <dt className="col-8">Time Limit</dt>
            <dd className="col-4">
              {quiz.settings?.timeLimitMinutes
                ? `${quiz.settings.timeLimitMinutes} Minutes`
                : '—'}
            </dd>

            <dt className="col-8">Multiple Attempts</dt>
            <dd className="col-4">
              {quiz.settings?.multipleAttempts
                ? `Yes (${quiz.settings.maxAttempts ?? 1} max)`
                : 'No'}
            </dd>

            <dt className="col-8">Show Correct Answers</dt>
            <dd className="col-4">
              {quiz.settings?.showCorrectAnswers
                ? quiz.settings.showCorrectAnswers.replace(/_/g, ' ')
                : '—'}
            </dd>

            <dt className="col-8">Access Code</dt>
            <dd className="col-4">
              {quiz.settings?.accessCode ? 'Required' : '—'}
            </dd>

            <dt className="col-8">One Question at a Time</dt>
            <dd className="col-4">
              {quiz.settings?.oneQuestionAtATime ? 'Yes' : 'No'}
            </dd>

            <dt className="col-8">Webcam Required</dt>
            <dd className="col-4">
              {quiz.settings?.webcamRequired ? 'Yes' : 'No'}
            </dd>

            <dt className="col-8">Lock After Answering</dt>
            <dd className="col-4">
              {quiz.settings?.lockAfterAnswering ? 'Yes' : 'No'}
            </dd>
          </dl>
        </Col>
      </Row>

      {!isFaculty && (
        <div className="mt-4">
          <h5 className="mb-3">My Attempts</h5>
          {aLoading ? (
            <div className="text-muted">Loading attempts…</div>
          ) : attempts.length === 0 ? (
            <div className="text-muted">No attempts yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>Attempt</th>
                    <th>Submitted</th>
                    <th style={{ width: 140 }} className="text-end">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a, idx) => {
                    const to = `/Kambaz/Courses/${cid}/Quizzes/${qid}/Attempts/${a._id}`
                    return (
                      <tr
                        key={a._id}
                        onClick={() => navigate(to)}
                        onKeyDown={(e) =>
                          (e.key === 'Enter' || e.key === ' ') && navigate(to)
                        }
                        role="button"
                        tabIndex={0}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="text-muted">#{attempts.length - idx}</td>
                        <td>{formatDateTime(a.submittedAt)}</td>
                        <td className="text-end">
                          <strong>{a.score}</strong>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes`} className="btn btn-light">
          Back to Quizzes
        </Link>
      </div>
    </div>
  )
}
