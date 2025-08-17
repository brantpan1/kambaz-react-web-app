import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import {
  Button,
  ListGroup,
  Row,
  Col,
  Form,
  Spinner,
} from 'react-bootstrap'
import {
  useGetQuestionsByQuizQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '@features/quizzes/quizzesApi'
import type {
  Question,
  McqQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
} from '@features/quizzes/types'

type EditingState = { [id: string]: Question }

export default function QuestionsEditor() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>()
  const role = useSelector((s: RootState) => s.auth.currentUser?.role)
  const isFaculty = role === 'FACULTY' || role === 'ADMIN'

  const {
    data: questions = [],
    isLoading,
    isFetching,
  } = useGetQuestionsByQuizQuery(qid!, { skip: !qid })

  const [createQuestion, { isLoading: creating }] = useCreateQuestionMutation()
  const [updateQuestion, { isLoading: saving }] = useUpdateQuestionMutation()
  const [deleteQuestion, { isLoading: removing }] = useDeleteQuestionMutation()

  const [editing, setEditing] = useState<EditingState>({})

  useEffect(() => {
    setEditing({})
  }, [qid])

  const startEdit = (q: Question) => setEditing((e) => ({ ...e, [q._id]: q }))
  const cancelEdit = (id: string) =>
    setEditing((e) => {
      const n = { ...e }
      delete n[id]
      return n
    })

  const onField = (id: string, key: keyof Question, value: any) =>
    setEditing((e) => ({ ...e, [id]: { ...(e[id] as any), [key]: value } }))

  const persist = async (id: string) => {
    const patch = editing[id]
    await updateQuestion({ id, patch }).unwrap()
    cancelEdit(id)
  }

  const addNew = async () => {
    if (!qid) return
    await createQuestion({
      quizId: qid,
      body: {
        type: 'mcq',
        title: 'New Question',
        points: 1,
        text: '',
        choices: ['Choice A', 'Choice B', 'Choice C'],
        correctIndex: 0,
      } as Partial<McqQuestion>,
    }).unwrap()
  }

  const totalPoints = useMemo(
    () => (questions ?? []).reduce((sum, q) => sum + (q.points || 0), 0),
    [questions],
  )

  if (!isFaculty) {
    return (
      <div className="mt-3 text-muted">
        You don’t have permission to edit questions.{' '}
        <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>Back to quiz</Link>
      </div>
    )
  }

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div id="wd-quiz-questions" className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Questions</h4>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted">
            Points: <strong>{totalPoints}</strong>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={addNew}
            disabled={creating}
          >
            + New Question
          </Button>
          <Link
            className="btn btn-light btn-sm"
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/Edit`}
          >
            Back to Details
          </Link>
        </div>
      </div>

      <ListGroup className="rounded-0">
        {questions.length === 0 ? (
          <ListGroup.Item className="p-3 text-muted">
            No questions yet. Click “New Question”.
          </ListGroup.Item>
        ) : (
          questions.map((q) => {
            const isEditing = !!editing[q._id]
            return (
              <ListGroup.Item key={q._id} className="p-3">
                {!isEditing ? (
                  <Row className="g-3 align-items-start">
                    <Col>
                      <div className="fw-bold">
                        {q.title} <span className="text-muted">({q.type})</span>
                      </div>
                      <div className="small text-muted">{q.points} pts</div>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => startEdit(q)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={removing}
                        onClick={() =>
                          deleteQuestion({ quizId: q.quiz, id: q._id })
                        }
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <QuestionEditor
                    q={editing[q._id]}
                    set={(k, v) => onField(q._id, k as any, v)}
                    onCancel={() => cancelEdit(q._id)}
                    onSave={() => persist(q._id)}
                    saving={saving}
                  />
                )}
              </ListGroup.Item>
            )
          })
        )}
      </ListGroup>
    </div>
  )
}

function QuestionEditor({
  q,
  set,
  onCancel,
  onSave,
  saving,
}: {
  q: Question
  set: (k: keyof Question | string, v: any) => void
  onCancel: () => void
  onSave: () => void
  saving: boolean
}) {
  return (
    <div>
      <Row className="mb-2">
        <Col md={8}>
          <Form.Control
            placeholder="Title"
            value={q.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </Col>
        <Col md={4}>
          <div className="d-flex gap-2">
            <Form.Select
              value={q.type}
              onChange={(e) => set('type', e.target.value)}
            >
              <option value="mcq">Multiple Choice</option>
              <option value="truefalse">True/False</option>
              <option value="fillblank">Fill in the Blank</option>
            </Form.Select>
            <Form.Control
              type="number"
              min={0}
              style={{ maxWidth: 120 }}
              value={q.points}
              onChange={(e) =>
                set('points', parseInt(e.target.value || '0', 10))
              }
            />
          </div>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Question</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={q.text ?? ''}
          onChange={(e) => set('text', e.target.value)}
        />
      </Form.Group>

      {q.type === 'mcq' && <McqEditor q={q as any as McqQuestion} set={set} />}
      {q.type === 'truefalse' && (
        <TrueFalseEditor q={q as any as TrueFalseQuestion} set={set} />
      )}
      {q.type === 'fillblank' && (
        <FillBlankEditor q={q as any as FillBlankQuestion} set={set} />
      )}

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onSave} disabled={saving}>
          {saving ? (
            <Spinner size="sm" animation="border" className="me-2" />
          ) : null}
          Save
        </Button>
      </div>
    </div>
  )
}

function McqEditor({ q, set }: { q: McqQuestion; set: any }) {
  const addChoice = () =>
    set('choices', [...(q.choices || []), `Choice ${q.choices.length + 1}`])
  const setChoice = (i: number, v: string) => {
    const next = [...q.choices]
    next[i] = v
    set('choices', next)
  }
  const removeChoice = (i: number) => {
    const next = q.choices.filter((_, idx) => idx !== i)
    let correctIndex = q.correctIndex
    if (i === q.correctIndex) correctIndex = 0
    else if (i < q.correctIndex) correctIndex = Math.max(0, q.correctIndex - 1)
    set('choices', next)
    set('correctIndex', correctIndex)
  }

  return (
    <div>
      <div className="mb-2">Choices (select one correct)</div>
      {q.choices.map((c, i) => (
        <Row key={i} className="mb-2">
          <Col xs="auto" className="d-flex align-items-center">
            <Form.Check
              type="radio"
              name="mcq-correct"
              checked={q.correctIndex === i}
              onChange={() => set('correctIndex', i)}
            />
          </Col>
          <Col>
            <Form.Control
              value={c}
              onChange={(e) => setChoice(i, e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => removeChoice(i)}
            >
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="outline-primary" size="sm" onClick={addChoice}>
        + Add Choice
      </Button>
    </div>
  )
}

function TrueFalseEditor({ q, set }: { q: TrueFalseQuestion; set: any }) {
  return (
    <div className="d-flex gap-3 align-items-center">
      <Form.Check
        type="radio"
        name="tf"
        label="True"
        checked={q.correct === true}
        onChange={() => set('correct', true)}
      />
      <Form.Check
        type="radio"
        name="tf"
        label="False"
        checked={q.correct === false}
        onChange={() => set('correct', false)}
      />
    </div>
  )
}

function FillBlankEditor({ q, set }: { q: FillBlankQuestion; set: any }) {
  const add = () => set('answers', [...(q.answers || []), ''])
  const setAns = (i: number, v: string) => {
    const next = [...(q.answers || [])]
    next[i] = v
    set('answers', next)
  }
  const remove = (i: number) => {
    const next = (q.answers || []).filter((_, idx) => idx !== i)
    set('answers', next)
  }
  return (
    <div>
      <div className="mb-2 d-flex align-items-center gap-3">
        <div>Possible Answers</div>
        <Form.Check
          type="switch"
          label="Case-insensitive"
          checked={!!q.caseInsensitive}
          onChange={(e) => set('caseInsensitive', e.target.checked)}
        />
      </div>
      {(q.answers || []).map((a, i) => (
        <Row key={i} className="mb-2">
          <Col>
            <Form.Control
              value={a}
              onChange={(e) => setAns(i, e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => remove(i)}
            >
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="outline-primary" size="sm" onClick={add}>
        + Add Answer
      </Button>
    </div>
  )
}
