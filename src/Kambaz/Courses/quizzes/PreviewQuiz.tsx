import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import {
  Button,
  Spinner,
  Alert,
  Card,
  Form,
  Row,
  Col,
  ListGroup,
  Badge,
} from 'react-bootstrap'
import {
  useGetQuizByIdQuery,
  useGetQuestionsByQuizQuery,
} from '@features/quizzes/quizzesApi'
import type { Question } from '@features/quizzes/types'
import { scoreQuiz, type AnswerPayload } from '@features/quizzes/scoring'

function defaultAnswerFor(q: Question): AnswerPayload {
  switch (q.type) {
    case 'mcq':
      return { questionId: q._id, type: 'mcq', choiceIndex: null }
    case 'truefalse':
      return { questionId: q._id, type: 'truefalse', value: null }
    default:
      return { questionId: q._id, type: 'fillblank', value: '' }
  }
}

function useCountdown(seconds: number, running: boolean, onExpire: () => void) {
  const [remain, setRemain] = useState<number>(seconds)
  const ref = useRef<number | null>(null)

  useEffect(() => setRemain(seconds), [seconds])

  useEffect(() => {
    if (!running || seconds <= 0) return
    if (ref.current) window.clearInterval(ref.current)
    ref.current = window.setInterval(() => {
      setRemain((s) => {
        if (s <= 1) {
          window.clearInterval(ref.current!)
          onExpire()
          return 0
        }
        return s - 1
      })
    }, 1000) as unknown as number
    return () => {
      if (ref.current) window.clearInterval(ref.current)
    }
  }, [running, seconds, onExpire])

  const mm = Math.floor(remain / 60)
  const ss = remain % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
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

export default function PreviewQuiz() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>()
  const role = useSelector((s: RootState) => s.auth.currentUser?.role)
  const isFaculty = role === 'FACULTY' || role === 'ADMIN'

  const { data: quiz, isLoading: ql } = useGetQuizByIdQuery(qid!, {
    skip: !qid,
  })
  const { data: questions = [], isLoading: sl } = useGetQuestionsByQuizQuery(
    qid!,
    { skip: !qid },
  )

  const [answers, setAnswers] = useState<AnswerPayload[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{
    score: number
    details: { questionId: string; correct: boolean }[]
  } | null>(null)

  const [oqIdx, setOqIdx] = useState(0)

  useEffect(() => {
    if (!questions || questions.length === 0) return
    setAnswers((prev) => {
      const map = new Map(prev.map((a) => [a.questionId, a]))
      for (const q of questions) {
        if (!map.has(q._id)) map.set(q._id, defaultAnswerFor(q))
      }
      return Array.from(map.values())
    })
  }, [qid, questions])

  const totalPoints = useMemo(
    () => (questions || []).reduce((s, q) => s + (q.points || 0), 0),
    [questions],
  )

  const timeLimitMin = quiz?.settings?.timeLimitMinutes ?? 0
  const timeLeftLabel = useCountdown(
    Math.max(0, timeLimitMin) * 60,
    !!quiz && timeLimitMin > 0 && !submitted,
    () => submit(), // auto-submit preview too
  )

  if (!isFaculty) {
    return (
      <Alert variant="warning" className="mt-3">
        Only faculty/admin can preview quizzes.
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

  const set = (partial: AnswerPayload) =>
    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.questionId === partial.questionId)
      if (idx !== -1) {
        const next = prev.slice()
        next[idx] = { ...prev[idx], ...partial } as any
        return next
      }
      return [...prev, partial]
    })

  const submit = () => {
    const r = scoreQuiz(questions, answers)
    setResult(r)
    setSubmitted(true)
  }

  const oqaat = !!quiz.settings?.oneQuestionAtATime

  return (
    <div id="wd-quiz-preview" className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">{quiz.title} — Preview</h3>
        <div className="d-flex align-items-center gap-3 text-muted">
          <div>
            Total Points: <strong>{totalPoints}</strong>
          </div>
          {timeLimitMin > 0 && !submitted && (
            <Badge bg="secondary" pill title="Time remaining">
              {timeLeftLabel}
            </Badge>
          )}
        </div>
      </div>

      {!oqaat ? (
        <QuestionsAll
          questions={questions}
          answers={answers}
          set={set}
          submitted={submitted}
          result={result}
        />
      ) : (
        <Row>
          <Col lg={8}>
            <QuestionsStepper
              questions={questions}
              answers={answers}
              set={set}
              submitted={submitted}
              result={result}
              idx={oqIdx}
              setIdx={setOqIdx}
            />
          </Col>
          <Col lg={4}>
            <Card>
              <Card.Header>Questions</Card.Header>
              <ListGroup variant="flush">
                {questions.map((q, i) => {
                  const a =
                    answers.find((x) => x.questionId === q._id) ||
                    defaultAnswerFor(q)
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
      )}

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Link
          to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
          className="btn btn-light"
        >
          Back
        </Link>
        <Button variant="danger" onClick={submit} disabled={submitted}>
          Submit
        </Button>
      </div>

      {submitted && result && (
        <Card className="mt-3">
          <Card.Body>
            <h5 className="mb-0">
              Score: {result.score} / {totalPoints}
            </h5>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

function QuestionsAll({
  questions,
  answers,
  set,
  submitted,
  result,
}: {
  questions: Question[]
  answers: AnswerPayload[]
  set: (a: AnswerPayload) => void
  submitted: boolean
  result: { details: { questionId: string; correct: boolean }[] } | null
}) {
  const correctMap = new Map(
    result?.details.map((d) => [d.questionId, d.correct]),
  )
  return (
    <>
      {questions.map((q, i) => {
        const a =
          answers.find((x) => x.questionId === q._id) ?? defaultAnswerFor(q)
        return (
          <QuestionCard
            key={q._id}
            n={i + 1}
            q={q}
            a={a}
            set={set}
            showResult={submitted}
            correct={correctMap.get(q._id)}
          />
        )
      })}
    </>
  )
}

function QuestionsStepper({
  questions,
  answers,
  set,
  submitted,
  result,
  idx,
  setIdx,
}: {
  questions: Question[]
  answers: AnswerPayload[]
  set: (a: AnswerPayload) => void
  submitted: boolean
  result: { details: { questionId: string; correct: boolean }[] } | null
  idx: number
  setIdx: (i: number) => void
}) {
  const total = questions.length
  const current = questions[idx]
  const correctMap = new Map(
    result?.details.map((d) => [d.questionId, d.correct]),
  )
  const a = current
    ? (answers.find((x) => x.questionId === current._id) ??
      defaultAnswerFor(current))
    : undefined

  if (!current || !a) return null

  return (
    <>
      <QuestionCard
        n={idx + 1}
        q={current}
        a={a}
        set={set}
        showResult={submitted}
        correct={correctMap.get(current._id)}
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
  showResult,
  correct,
}: {
  n: number
  q: Question
  a: AnswerPayload
  set: (a: AnswerPayload) => void
  showResult: boolean
  correct?: boolean
}) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <h5 className="mb-2">
            Question {n} · <small className="text-muted">{q.points} pts</small>
          </h5>
          {showResult && (
            <span className={correct ? 'text-success' : 'text-danger'}>
              {correct ? 'Correct' : 'Incorrect'}
            </span>
          )}
        </div>
        {q.title && <div className="fw-bold mb-1">{q.title}</div>}
        {q.text && <div className="mb-3">{q.text}</div>}

        {q.type === 'mcq' && (
          <div className="d-flex flex-column gap-2">
            {(q as any).choices.map((c: string, i: number) => (
              <Form.Check
                key={i}
                type="radio"
                name={`q-${q._id}`}
                label={c}
                checked={(a as any)?.choiceIndex === i}
                onChange={() =>
                  set({ questionId: q._id, type: 'mcq', choiceIndex: i })
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
              checked={(a as any)?.value === true}
              onChange={() =>
                set({ questionId: q._id, type: 'truefalse', value: true })
              }
            />
            <Form.Check
              type="radio"
              name={`q-${q._id}`}
              label="False"
              checked={(a as any)?.value === false}
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
                value={(a as any)?.value || ''}
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
