import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import {
  Button,
  Spinner,
  Card,
  Form,
  Row,
  Col,
  Alert,
  Modal,
  ListGroup,
  Badge,
} from 'react-bootstrap'
import {
  useGetQuizByIdQuery,
  useGetQuestionsByQuizQuery,
  useStartAttemptMutation,
  useSubmitAttemptMutation,
} from '@features/quizzes/quizzesApi'
import type { Question } from '@features/quizzes/types'
import type { AnswerPayload } from '@features/quizzes/scoring'

type ChoiceOrderMap = Record<string, number[]>

function useCountdown(seconds: number, running: boolean, onExpire: () => void) {
  const [remain, setRemain] = useState<number>(seconds)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    setRemain(seconds)
  }, [seconds])

  useEffect(() => {
    if (!running || seconds <= 0) return
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    intervalRef.current = window.setInterval(() => {
      setRemain((s) => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!)
          onExpire()
          return 0
        }
        return s - 1
      })
    }, 1000) as unknown as number
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running, seconds, onExpire])

  const mm = Math.floor(remain / 60)
  const ss = remain % 60
  const label = `${mm}:${ss.toString().padStart(2, '0')}`
  return { remain, label }
}

function isAnswered(q: Question, a?: AnswerPayload) {
  if (!a) return false
  switch (q.type) {
    case 'mcq':
      return (
        (a as any).choiceIndex !== null && (a as any).choiceIndex !== undefined
      )
    case 'truefalse':
      return (a as any).value === true || (a as any).value === false
    case 'fillblank':
      return !!(a as any).value && String((a as any).value).trim().length > 0
  }
}

export default function TakeQuiz() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>()
  const navigate = useNavigate()
  const role = useSelector((s: RootState) => s.auth.currentUser?.role)
  const isStudent = role === 'STUDENT'

  const { data: quiz, isLoading: ql } = useGetQuizByIdQuery(qid!, {
    skip: !qid,
  })
  const { data: questions = [], isLoading: sl } = useGetQuestionsByQuizQuery(
    qid!,
    { skip: !qid },
  )

  const [answers, setAnswers] = useState<AnswerPayload[]>([])
  const [startAttempt, { isLoading: starting }] = useStartAttemptMutation()
  const [submitAttempt, { isLoading: submitting }] = useSubmitAttemptMutation()
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [code, setCode] = useState('')
  const [oqIdx, setOqIdx] = useState(0)

  const choiceOrders: ChoiceOrderMap = useMemo(() => {
    const map: ChoiceOrderMap = {}
    const shuffle = (arr: number[]) => {
      const a = arr.slice()
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }
    for (const q of questions) {
      if (q.type === 'mcq' && Array.isArray((q as any).choices)) {
        const n = (q as any).choices.length
        const identity = Array.from({ length: n }, (_, i) => i)
        map[q._id] =
          quiz?.settings?.shuffleAnswers && n > 1 ? shuffle(identity) : identity
      }
    }
    return map
  }, [questions, quiz?.settings?.shuffleAnswers])

  useEffect(() => {
    setAnswers(
      (questions || []).map((q) => {
        switch (q.type) {
          case 'mcq':
            return { questionId: q._id, type: 'mcq', choiceIndex: null }
          case 'truefalse':
            return { questionId: q._id, type: 'truefalse', value: null }
          default:
            return { questionId: q._id, type: 'fillblank', value: '' }
        }
      }),
    )
  }, [qid, questions])

  const totalPoints = useMemo(
    () => (questions || []).reduce((s, q) => s + (q.points || 0), 0),
    [questions],
  )

  useEffect(() => {
    if (quiz?.settings?.accessCode) setShowCodeModal(true)
  }, [quiz?.settings?.accessCode])

  const begin = async () => {
    if (!qid) return
    if (quiz?.settings?.accessCode && code !== quiz.settings.accessCode) {
      alert('Invalid access code')
      return
    }
    const res = await startAttempt(qid!).unwrap()
    setAttemptId(res.attemptId)
    setShowCodeModal(false)
  }

  const set = (partial: AnswerPayload) =>
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === partial.questionId ? ({ ...a, ...partial } as any) : a,
      ),
    )

  const doSubmit = async () => {
    if (!attemptId) return
    const payload = answers.map((a) => {
      switch (a.type) {
        case 'mcq':
          return {
            questionId: a.questionId,
            type: a.type,
            choiceIndex: (a as any).choiceIndex,
          }
        case 'truefalse':
          return {
            questionId: a.questionId,
            type: a.type,
            value: (a as any).value,
          }
        case 'fillblank':
          return {
            questionId: a.questionId,
            type: a.type,
            value: (a as any).value,
          }
      }
    })
    const resp = await submitAttempt({
      quizId: quiz?._id as string,
      attemptId,
      answers: payload,
    }).unwrap()
    alert(`Submitted! Score: ${(resp as any).score} / ${totalPoints}`)
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)
  }

  // timer (only after Begin; only if timeLimitMinutes > 0)
  const timeLimitMin = quiz?.settings?.timeLimitMinutes ?? 0
  const { label: timeLeftLabel } = useCountdown(
    Math.max(0, timeLimitMin) * 60,
    !!attemptId && timeLimitMin > 0,
    () => doSubmit(), // auto-submit on expire
  )

  if (!isStudent) {
    return (
      <Alert variant="warning" className="mt-3">
        Only students can take quizzes.
      </Alert>
    )
  }

  if (ql || sl || !quiz) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  const oqaat = !!quiz.settings?.oneQuestionAtATime

  return (
    <div id="wd-quiz-take" className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">{quiz.title}</h3>
        <div className="d-flex align-items-center gap-3 text-muted">
          <div>
            Total Points: <strong>{totalPoints}</strong>
          </div>
          {attemptId && timeLimitMin > 0 && (
            <Badge bg="secondary" pill title="Time remaining">
              {timeLeftLabel}
            </Badge>
          )}
        </div>
      </div>

      {!attemptId ? (
        <div className="text-center py-5">
          <Button variant="danger" disabled={starting} onClick={begin}>
            Begin
          </Button>
          <div className="mt-3">
            <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>Cancel</Link>
          </div>
        </div>
      ) : !oqaat ? (
        <>
          <QuestionsAll
            questions={questions}
            answers={answers}
            set={set}
            choiceOrders={choiceOrders}
          />
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="danger" disabled={submitting} onClick={doSubmit}>
              {submitting ? (
                <Spinner size="sm" animation="border" className="me-2" />
              ) : null}
              Submit Quiz
            </Button>
          </div>
        </>
      ) : (
        <>
          <Row>
            <Col lg={8}>
              <QuestionsStepper
                questions={questions}
                answers={answers}
                set={set}
                choiceOrders={choiceOrders}
                idx={oqIdx}
                setIdx={setOqIdx}
              />
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button
                  variant="danger"
                  disabled={submitting}
                  onClick={doSubmit}
                >
                  {submitting ? (
                    <Spinner size="sm" animation="border" className="me-2" />
                  ) : null}
                  Submit Quiz
                </Button>
              </div>
            </Col>
            <Col lg={4}>
              <Card>
                <Card.Header>Questions</Card.Header>
                <ListGroup variant="flush">
                  {questions.map((q, i) => {
                    const a = answers.find((x) => x.questionId === q._id)
                    const answered = isAnswered(q, a)
                    return (
                      <ListGroup.Item
                        key={q._id}
                        action
                        active={i === oqIdx}
                        onClick={() => setOqIdx(i)}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>Question {i + 1}</span>
                        {answered ? (
                          <Badge bg="success">Answered</Badge>
                        ) : (
                          <Badge bg="secondary">—</Badge>
                        )}
                      </ListGroup.Item>
                    )
                  })}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}

      <Modal show={showCodeModal} onHide={() => {}} backdrop="static">
        <Modal.Header>
          <Modal.Title>Enter Access Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            autoFocus
            placeholder="Access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => history.back()}>
            Cancel
          </Button>
          <Button variant="danger" disabled={!code} onClick={begin}>
            {starting ? (
              <Spinner size="sm" animation="border" className="me-2" />
            ) : null}
            Begin
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

function QuestionsAll({
  questions,
  answers,
  set,
  choiceOrders,
}: {
  questions: Question[]
  answers: AnswerPayload[]
  set: (a: AnswerPayload) => void
  choiceOrders: Record<string, number[]>
}) {
  return (
    <>
      {questions.map((q, i) => (
        <QuestionCard
          key={q._id}
          n={i + 1}
          q={q}
          a={answers.find((x) => x.questionId === q._id)!}
          set={set}
          order={choiceOrders[q._id]}
        />
      ))}
    </>
  )
}

function QuestionsStepper({
  questions,
  answers,
  set,
  choiceOrders,
  idx,
  setIdx,
}: {
  questions: Question[]
  answers: AnswerPayload[]
  set: (a: AnswerPayload) => void
  choiceOrders: Record<string, number[]>
  idx: number
  setIdx: (i: number) => void
}) {
  const current = questions[idx]
  const total = questions.length
  if (!current) return null
  return (
    <>
      <QuestionCard
        n={idx + 1}
        q={current}
        a={answers.find((x) => x.questionId === current._id)!}
        set={set}
        order={choiceOrders[current._id]}
      />
      <div className="d-flex justify-content-between mt-3">
        <Button
          variant="light"
          disabled={idx === 0}
          onClick={() => setIdx(Math.max(0, idx - 1))}
        >
          Previous
        </Button>
        <div className="text-muted">
          Question {idx + 1} of {total}
        </div>
        <Button
          variant="light"
          disabled={idx === total - 1}
          onClick={() => setIdx(Math.min(total - 1, idx + 1))}
        >
          Next
        </Button>
      </div>
    </>
  )
}

function QuestionCard({
  n,
  q,
  a,
  set,
  order,
}: {
  n: number
  q: Question
  a: AnswerPayload
  set: (a: AnswerPayload) => void
  order?: number[]
}) {
  const choices = (q as any).choices as string[] | undefined
  const effectiveOrder =
    q.type === 'mcq' && Array.isArray(choices)
      ? (order ?? Array.from({ length: choices.length }, (_, i) => i))
      : []

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5 className="mb-2">
          Question {n} · <small className="text-muted">{q.points} pts</small>
        </h5>
        {q.title && <div className="fw-bold mb-1">{q.title}</div>}
        {q.text && <div className="mb-3">{q.text}</div>}

        {q.type === 'mcq' && choices && (
          <div className="d-flex flex-column gap-2">
            {effectiveOrder.map((origIdx) => (
              <Form.Check
                key={origIdx}
                type="radio"
                name={`q-${q._id}`}
                label={choices[origIdx]}
                checked={(a as any).choiceIndex === origIdx}
                onChange={() =>
                  set({ questionId: q._id, type: 'mcq', choiceIndex: origIdx })
                }
              />
            ))}
          </div>
        )}

        {q.type === 'truefalse' && (
          <div className="d-flex gap-4">
            <Form.Check
              type="radio"
              name={`q-${q._id}`}
              label="True"
              checked={(a as any).value === true}
              onChange={() =>
                set({ questionId: q._id, type: 'truefalse', value: true })
              }
            />
            <Form.Check
              type="radio"
              name={`q-${q._id}`}
              label="False"
              checked={(a as any).value === false}
              onChange={() =>
                set({ questionId: q._id, type: 'truefalse', value: false })
              }
            />
          </div>
        )}

        {q.type === 'fillblank' && (
          <Row>
            <Col md={6}>
              <Form.Control
                placeholder="Type your answer"
                value={(a as any).value || ''}
                onChange={(e) =>
                  set({
                    questionId: q._id,
                    type: 'fillblank',
                    value: e.target.value,
                  })
                }
              />
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  )
}
