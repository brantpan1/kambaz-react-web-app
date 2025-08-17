import {
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'
import { FiChevronRight } from 'react-icons/fi'
import CourseNavigation from './navigation'
import Home from './home'
import Modules from './modules'
import Assignments from './assignments'
import AssignmentEditor from './assignments/editor'
import PeopleTable from './people/table'

import { useGetCourseByIdQuery } from '@features/courses/coursesApi'
import { useGetQuizByIdQuery } from '@features/quizzes/quizzesApi'
import QuizDetails from './quizzes/details'
import QuizzesList from './quizzes'
import QuizEditor from './quizzes/editor'
import QuestionsEditor from './quizzes/questions'
import PreviewQuiz from './quizzes/preview'
import TakeQuiz from './quizzes/take'
import AttemptDetails from './quizzes/attemptDetails'

export default function Courses() {
  const { cid } = useParams<{ cid: string }>()
  const { pathname } = useLocation()

  const { data: course } = useGetCourseByIdQuery(cid!, { skip: !cid })

  const segments = pathname.split('/').filter(Boolean)
  const quizzesIdx = segments.findIndex((s) => s === 'Quizzes')
  const qid =
    quizzesIdx !== -1 && segments.length > quizzesIdx + 1
      ? segments[quizzesIdx + 1]
      : undefined

  const { data: quiz } = useGetQuizByIdQuery(qid as string, {
    skip: !qid,
  })

  const last = segments[segments.length - 1] || 'Home'
  let page: string

  if (quizzesIdx !== -1) {
    const afterQid = segments[quizzesIdx + 2]
    const base = quiz?.title ?? (qid || 'Quizzes')
    if (!qid) {
      page = 'Quizzes'
    } else if (!afterQid) {
      page = base
    } else if (['Edit', 'Questions', 'Preview', 'Take'].includes(afterQid)) {
      page = `${base} · ${afterQid}`
    } else if (afterQid === 'Attempts') {
      page = `${base} · Attempt`
    } else {
      page = base
    }
  } else {
    page = ['Home', 'Modules', 'People', 'Assignments'].includes(last)
      ? last
      : segments[segments.length - 2] === 'Assignments'
        ? 'Assignment'
        : last
  }

  const displayName = course?.name ?? cid

  return (
    <div id="wd-courses" className="px-3">
      <div className="d-flex align-items-center py-2 border-bottom mb-3">
        <AiOutlineMenu className="fs-4 text-danger me-3" />
        <span className="fw-bold fs-5 text-danger me-2">{displayName}</span>
        <FiChevronRight className="text-muted me-2" />
        <span className="fw-bold fs-5">{page}</span>
      </div>
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill ms-md-4">
          <Routes>
            <Route path="/" element={<Navigate to="Home" replace />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="People" element={<PeopleTable />} />

            <Route path="Quizzes" element={<QuizzesList />} />
            <Route path="Quizzes/:qid" element={<QuizDetails />} />
            <Route path="Quizzes/:qid/Edit" element={<QuizEditor />} />
            <Route
              path="Quizzes/:qid/Questions"
              element={<QuestionsEditor />}
            />
            <Route path="Quizzes/:qid/Preview" element={<PreviewQuiz />} />
            <Route path="Quizzes/:qid/Take" element={<TakeQuiz />} />
            <Route
              path="Quizzes/:qid/Attempts/:aid"
              element={<AttemptDetails />}
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}
