export type QuizType =
  | 'GRADED_QUIZ'
  | 'PRACTICE_QUIZ'
  | 'GRADED_SURVEY'
  | 'UNGRADED_SURVEY'

export interface QuizSettings {
  shuffleAnswers: boolean
  timeLimitMinutes?: number
  multipleAttempts: boolean
  maxAttempts?: number
  showCorrectAnswers?: 'immediately' | 'after_due' | 'never'
  accessCode?: string
  oneQuestionAtATime: boolean
  webcamRequired: boolean
  lockAfterAnswering: boolean
}

export interface Quiz {
  _id: string
  course: string
  title: string
  description?: string
  type: QuizType
  assignmentGroup: 'QUIZZES' | 'EXAMS' | 'ASSIGNMENTS' | 'PROJECT'
  published: boolean
  points: number
  dueDate?: string
  availableDate?: string
  availableUntil?: string
  questionCount?: number
  settings: QuizSettings
}

export type QuestionType = 'mcq' | 'truefalse' | 'fillblank'

export interface QuestionBase {
  _id: string
  quiz: string
  type: QuestionType
  title: string
  points: number
  text?: string
}

export interface McqQuestion extends QuestionBase {
  type: 'mcq'
  choices: string[]
  correctIndex: number
}
export interface TrueFalseQuestion extends QuestionBase {
  type: 'truefalse'
  correct: boolean
}
export interface FillBlankQuestion extends QuestionBase {
  type: 'fillblank'
  answers: string[]
  caseInsensitive?: boolean
}
export type Question = McqQuestion | TrueFalseQuestion | FillBlankQuestion

export interface AttemptAnswer {
  question: string
  type: QuestionType
  choiceIndex?: number | null
  valueBool?: boolean | null
  valueText?: string | null
}

export interface Attempt {
  _id: string
  quiz: string
  user: string
  answers: AttemptAnswer[]
  score: number
  submittedAt: string
}
