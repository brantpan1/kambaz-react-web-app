import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import {
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
  ButtonGroup,
} from 'react-bootstrap'
import {
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
  useTogglePublishMutation,
} from '@features/quizzes/quizzesApi'
import { format, parseISO, isValid } from 'date-fns'
import type { Quiz, QuizType } from '@features/quizzes/types'

const QUIZ_TYPES: { value: QuizType; label: string }[] = [
  { value: 'GRADED_QUIZ', label: 'Graded Quiz' },
  { value: 'PRACTICE_QUIZ', label: 'Practice Quiz' },
  { value: 'GRADED_SURVEY', label: 'Graded Survey' },
  { value: 'UNGRADED_SURVEY', label: 'Ungraded Survey' },
]
const GROUPS = ['QUIZZES', 'EXAMS', 'ASSIGNMENTS', 'PROJECT'] as const

const isoForInput = (iso?: string) => {
  if (!iso) return ''
  const date = parseISO(iso)
  return isValid(date) ? format(date, "yyyy-MM-dd'T'HH:mm") : ''
}

function parseLocalToISOOrUndefined(local: string) {
  const full = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
  if (!local) return undefined
  if (!full.test(local)) return 'INVALID' as const
  const date = parseISO(local)
  if (!isValid(date)) return 'INVALID' as const
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS")
}

type DateErrors = Partial<{
  availableDate: string
  dueDate: string
  availableUntil: string
}>
function computeDateErrors(form: Partial<Quiz>): DateErrors {
  const errs: DateErrors = {}

  const a = form.availableDate ? new Date(form.availableDate) : null
  const d = form.dueDate ? new Date(form.dueDate) : null
  const u = form.availableUntil ? new Date(form.availableUntil) : null

  if (!form.availableDate) errs.availableDate = 'Required (pick date & time)'
  if (!form.dueDate) errs.dueDate = 'Required (pick date & time)'
  if (!form.availableUntil) errs.availableUntil = 'Required (pick date & time)'

  if (a && d && a > d) {
    errs.dueDate = 'Due must be on/after Available from'
  }
  if (d && u && d > u) {
    console.log('here')
    errs.dueDate = 'Due must be on/after Until'
  }
  if (a && u && a > u) {
    errs.availableUntil = 'Until must be on/after Available from'
  }

  return errs
}

export default function QuizEditor() {
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
  const [updateQuiz, { isLoading: saving }] = useUpdateQuizMutation()
  const [togglePublish, { isLoading: toggling }] = useTogglePublishMutation()

  const [form, setForm] = useState<Partial<Quiz>>({})
  const [touched, setTouched] = useState<{ [k in keyof DateErrors]?: boolean }>(
    {},
  )
  const dueRef = useRef<HTMLInputElement>(null)
  const availRef = useRef<HTMLInputElement>(null)
  const untilRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (quiz) setForm(quiz)
  }, [quiz])

  const disabled = saving || toggling
  const points = useMemo(() => Number(form.points ?? 0), [form.points])

  const timeLimit = form.settings?.timeLimitMinutes ?? 0
  const noLimit = timeLimit === 0

  if (!isFaculty) {
    return (
      <Alert variant="warning" className="mt-3">
        You don’t have permission to edit quizzes.
      </Alert>
    )
  }

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
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

  const set = (k: keyof Quiz, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const onDateLocalChange = (
    key: 'availableDate' | 'dueDate' | 'availableUntil',
    local: string,
  ) => {
    setTouched((t) => ({ ...t, [key]: true }))
    const parsed = parseLocalToISOOrUndefined(local)
    if (parsed === 'INVALID') {
      return
    }
    set(key, parsed)
  }

  const errors = computeDateErrors(form)
  const hasErrors = !!(
    errors.availableDate ||
    errors.dueDate ||
    errors.availableUntil
  )

  const focusFirstError = () => {
    if (errors.availableDate && availRef.current)
      return availRef.current.focus()
    if (errors.dueDate && dueRef.current) return dueRef.current.focus()
    if (errors.availableUntil && untilRef.current)
      return untilRef.current.focus()
  }

  const save = async (next?: Partial<Quiz>) => {
    if (hasErrors) {
      setTouched({ availableDate: true, dueDate: true, availableUntil: true })
      focusFirstError()
      return
    }
    await updateQuiz({ id: quiz._id, patch: { ...form, ...next } }).unwrap()
  }

  const saveAndBack = async () => {
    await save()
    if (!hasErrors) navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`)
  }

  const saveAndPublish = async () => {
    await save()
    if (!hasErrors) {
      await togglePublish({ id: quiz._id, published: true }).unwrap()
      navigate(`/Kambaz/Courses/${cid}/Quizzes`)
    }
  }

  return (
    <div id="wd-quiz-editor" className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Edit Quiz</h3>
        <ButtonGroup>
          <Button
            variant="light"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
            disabled={disabled}
          >
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            onClick={saveAndBack}
            disabled={disabled || hasErrors}
          >
            {saving ? (
              <Spinner size="sm" animation="border" className="me-2" />
            ) : null}
            Save
          </Button>
          <Button
            variant="danger"
            onClick={saveAndPublish}
            disabled={disabled || hasErrors}
          >
            {toggling ? (
              <Spinner size="sm" animation="border" className="me-2" />
            ) : null}
            Save & Publish
          </Button>
        </ButtonGroup>
      </div>

      <div className="mb-3">
        <NavLink
          to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Edit`}
          className="me-3"
        >
          Details
        </NavLink>
        <NavLink to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Questions`}>
          Questions
        </NavLink>
      </div>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={form.title ?? ''}
            onChange={(e) => set('title', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={form.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Quiz instructions..."
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Quiz Type
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              value={form.type ?? 'GRADED_QUIZ'}
              onChange={(e) => set('type', e.target.value)}
            >
              {QUIZ_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="number"
              value={points}
              min={0}
              onChange={(e) =>
                set('points', parseInt(e.target.value || '0', 10))
              }
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Assignment Group
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              value={(form.assignmentGroup as any) ?? 'QUIZZES'}
              onChange={(e) => set('assignmentGroup', e.target.value)}
            >
              {GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Shuffle Answers
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              type="switch"
              checked={!!form.settings?.shuffleAnswers}
              onChange={(e) =>
                set('settings', {
                  ...form.settings,
                  shuffleAnswers: e.target.checked,
                })
              }
              label={form.settings?.shuffleAnswers ? 'Yes' : 'No'}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Time Limit
          </Form.Label>
          <Col sm={9}>
            <div className="d-flex align-items-center gap-3">
              <Form.Check
                type="switch"
                id="wd-no-time-limit"
                checked={noLimit}
                onChange={(e) =>
                  set('settings', {
                    ...form.settings,
                    timeLimitMinutes: e.target.checked
                      ? 0
                      : timeLimit > 0
                        ? timeLimit
                        : 20,
                  })
                }
                label={noLimit ? 'No time limit' : 'Timed'}
              />

              <Form.Control
                style={{ maxWidth: 140 }}
                type="number"
                min={1}
                disabled={noLimit}
                value={noLimit ? '' : timeLimit}
                placeholder="20"
                onChange={(e) =>
                  set('settings', {
                    ...form.settings,
                    timeLimitMinutes: Math.max(
                      1,
                      parseInt(e.target.value || '0', 10),
                    ),
                  })
                }
              />
              <span className="text-muted">minutes</span>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Multiple Attempts
          </Form.Label>
          <Col sm={9}>
            <div className="d-flex align-items-center gap-3">
              <Form.Check
                type="switch"
                checked={!!form.settings?.multipleAttempts}
                onChange={(e) =>
                  set('settings', {
                    ...form.settings,
                    multipleAttempts: e.target.checked,
                  })
                }
                label={form.settings?.multipleAttempts ? 'Yes' : 'No'}
              />
              {form.settings?.multipleAttempts && (
                <Form.Control
                  style={{ maxWidth: 120 }}
                  type="number"
                  min={1}
                  value={form.settings?.maxAttempts ?? 1}
                  onChange={(e) =>
                    set('settings', {
                      ...form.settings,
                      maxAttempts: parseInt(e.target.value || '1', 10),
                    })
                  }
                />
              )}
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Show Correct Answers
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              value={form.settings?.showCorrectAnswers ?? 'immediately'}
              onChange={(e) =>
                set('settings', {
                  ...form.settings,
                  showCorrectAnswers: e.target.value as any,
                })
              }
            >
              <option value="immediately">Immediately</option>
              <option value="after_due">After Due Date</option>
              <option value="never">Never</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Access Code
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              value={form.settings?.accessCode ?? ''}
              onChange={(e) =>
                set('settings', {
                  ...form.settings,
                  accessCode: e.target.value,
                })
              }
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            One Question at a Time
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              type="switch"
              checked={!!form.settings?.oneQuestionAtATime}
              onChange={(e) =>
                set('settings', {
                  ...form.settings,
                  oneQuestionAtATime: e.target.checked,
                })
              }
              label={form.settings?.oneQuestionAtATime ? 'Yes' : 'No'}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Webcam Required
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              type="switch"
              checked={!!form.settings?.webcamRequired}
              onChange={(e) =>
                set('settings', {
                  ...form.settings,
                  webcamRequired: e.target.checked,
                })
              }
              label={form.settings?.webcamRequired ? 'Yes' : 'No'}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Lock Questions After Answering
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              type="switch"
              checked={!!form.settings?.lockAfterAnswering}
              onChange={(e) =>
                set('settings', {
                  ...form.settings,
                  lockAfterAnswering: e.target.checked,
                })
              }
              label={form.settings?.lockAfterAnswering ? 'Yes' : 'No'}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Due
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              ref={dueRef}
              type="datetime-local"
              value={isoForInput(form.dueDate)}
              onChange={(e) => onDateLocalChange('dueDate', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, dueDate: true }))}
              isInvalid={!!errors.dueDate && !!touched.dueDate}
            />
            <Form.Control.Feedback type="invalid">
              {touched.dueDate && errors.dueDate}
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Available from
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              ref={availRef}
              type="datetime-local"
              value={isoForInput(form.availableDate)}
              onChange={(e) =>
                onDateLocalChange('availableDate', e.target.value)
              }
              onBlur={() => setTouched((t) => ({ ...t, availableDate: true }))}
              isInvalid={!!errors.availableDate && !!touched.availableDate}
            />
            <Form.Control.Feedback type="invalid">
              {touched.availableDate && errors.availableDate}
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row>
          <Form.Label column sm={3}>
            Until
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              ref={untilRef}
              type="datetime-local"
              value={isoForInput(form.availableUntil)}
              onChange={(e) =>
                onDateLocalChange('availableUntil', e.target.value)
              }
              onBlur={() => setTouched((t) => ({ ...t, availableUntil: true }))}
              isInvalid={!!errors.availableUntil && !!touched.availableUntil}
            />
            <Form.Control.Feedback type="invalid">
              {touched.availableUntil && errors.availableUntil}
            </Form.Control.Feedback>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
