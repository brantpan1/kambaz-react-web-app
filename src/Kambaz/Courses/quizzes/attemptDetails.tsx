import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import {
  Alert,
  Badge,
  Card,
  Col,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap'
import {
  useGetAttemptByIdQuery,
  useGetQuizByIdQuery,
  useGetQuestionsByQuizQuery,
} from '@features/quizzes/quizzesApi'
import type { Question, AttemptAnswer } from '@features/quizzes/types'
import { BsCheckCircle, BsXCircle } from 'react-icons/bs'

function isCorrect(q: Question, a?: AttemptAnswer | null) {
  if (!a) return false
  if (q.type === 'mcq') {
    return a.choiceIndex !== null && a.choiceIndex === (q as any).correctIndex
  }
  if (q.type === 'truefalse') {
    return (
      typeof a.valueBool === 'boolean' && a.valueBool === (q as any).correct
    )
  }
  // fillblank
  const given = (a.valueText || '').trim()
  const list = ((q as any).answers || []).map((s: string) => s.toString())
  const ci = !!(q as any).caseInsensitive
  return list.some((ans: string) =>
    ci
      ? ans.trim().toLowerCase() === given.toLowerCase()
      : ans.trim() === given,
  )
}

function canShowCorrectAnswers(quiz: any) {
  const mode = quiz?.settings?.showCorrectAnswers ?? 'immediately'
  if (mode === 'never') return false
  if (mode === 'immediately') return true
  const due = quiz?.dueDate ? new Date(quiz.dueDate) : null
  if (!due) return true
  return new Date() >= due
}

export default function AttemptDetails() {
  const { cid, qid, aid } = useParams<{
    cid: string
    qid: string
    aid: string
  }>()
  const role = useSelector((s: RootState) => s.auth.currentUser?.role)
  const isFaculty = role === 'FACULTY' || role === 'ADMIN'
  const isStudent = role === 'STUDENT'

  const { data: quiz, isLoading: lq } = useGetQuizByIdQuery(qid!, {
    skip: !qid,
  })
  const { data: attempt, isLoading: la } = useGetAttemptByIdQuery(aid!, {
    skip: !aid,
  })
  const { data: questions = [], isLoading: lqs } = useGetQuestionsByQuizQuery(
    qid!,
    { skip: !qid },
  )

  const qmap = useMemo(
    () => new Map((questions || []).map((q) => [q._id, q])),
    [questions],
  )

  const showCorrect = canShowCorrectAnswers(quiz)

  if (lq || la || lqs || !quiz || !attempt) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (!isFaculty && !isStudent) {
    return (
      <Alert variant="warning" className="mt-3">
        You don’t have access to view attempts.
      </Alert>
    )
  }

  const submittedAt = attempt.submittedAt
    ? new Date(attempt.submittedAt).toLocaleString()
    : '—'

  const totalPoints = (questions || []).reduce((s, q) => s + (q.points || 0), 0)

  return (
    <div id="wd-quiz-attempt" className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="m-0">Attempt Details</h3>
          <div className="text-muted small">
            {quiz.title} · Submitted {submittedAt}
          </div>
        </div>
        <Badge bg="secondary">
          Score: {attempt.score} / {totalPoints}
        </Badge>
      </div>

      <Row>
        <Col lg={8}>
          {(attempt.answers || []).map((a, i) => {
            const q = qmap.get(a.question)
            if (!q) return null
            const correct = isCorrect(q, a)
            return (
              <Card className="mb-3" key={q._id}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-2">
                      Question {i + 1}{' '}
                      <small className="text-muted">· {q.points} pts</small>
                    </h5>
                    {correct ? (
                      <span className="text-success d-flex align-items-center">
                        <BsCheckCircle className="me-1" /> Correct
                      </span>
                    ) : (
                      <span className="text-danger d-flex align-items-center">
                        <BsXCircle className="me-1" /> Incorrect
                      </span>
                    )}
                  </div>

                  {q.title && <div className="fw-bold mb-1">{q.title}</div>}
                  {q.text && <div className="mb-3">{q.text}</div>}

                  {q.type === 'mcq' && (
                    <ListGroup className="mb-2">
                      {(q as any).choices?.map(
                        (choice: string, idx: number) => {
                          const isYour = a.choiceIndex === idx
                          const isCorrectChoice =
                            showCorrect && idx === (q as any).correctIndex
                          return (
                            <ListGroup.Item
                              key={idx}
                              className="d-flex justify-content-between align-items-center"
                              variant={
                                isYour && !correct
                                  ? 'danger'
                                  : isCorrectChoice
                                    ? 'success'
                                    : undefined
                              }
                            >
                              <span>{choice}</span>
                              <span className="d-flex align-items-center gap-2">
                                {isYour && (
                                  <Badge bg="secondary">Your answer</Badge>
                                )}
                                {isCorrectChoice && (
                                  <Badge bg="success">Correct</Badge>
                                )}
                              </span>
                            </ListGroup.Item>
                          )
                        },
                      )}
                    </ListGroup>
                  )}

                  {q.type === 'truefalse' && (
                    <div className="d-flex gap-3 mb-2">
                      <Badge bg="secondary">
                        Your answer: {String(a.valueBool)}
                      </Badge>
                      {showCorrect && (
                        <Badge bg="success">
                          Correct: {String((q as any).correct)}
                        </Badge>
                      )}
                    </div>
                  )}

                  {q.type === 'fillblank' && (
                    <div className="mb-2">
                      <div className="mb-1">
                        <Badge bg={correct ? 'success' : 'danger'}>
                          {correct ? 'Matched' : 'Not matched'}
                        </Badge>
                      </div>
                      <div className="mb-1">
                        <strong>Your answer:</strong>{' '}
                        {(a.valueText || '').toString()}
                      </div>
                      {showCorrect && (
                        <div className="small text-muted">
                          <strong>Accepted answers:</strong>{' '}
                          {((q as any).answers || []).join(', ') || '—'}
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            )
          })}
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>Summary</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Questions</span>
                <Badge bg="secondary">{questions.length}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Total Points</span>
                <Badge bg="secondary">{totalPoints}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Score</span>
                <Badge bg="secondary">
                  {attempt.score} / {totalPoints}
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Submitted</span>
                <span className="text-muted">{submittedAt}</span>
              </ListGroup.Item>
            </ListGroup>
            <Card.Body className="d-flex justify-content-between">
              <Link
                to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}
                className="btn btn-light"
              >
                Back to Quiz
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
