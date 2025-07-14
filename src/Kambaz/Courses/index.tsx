import {
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'
import { FiChevronRight } from 'react-icons/fi'
import CourseNavigation from './Navigation'
import Home from './Home'
import Modules from './Modules'
import Assignments from './Assignments'
import AssignmentEditor from './Assignments/Editor'
import PeopleTable from './People/Table'

export default function Courses() {
  const { cid } = useParams<string>()
  const { pathname } = useLocation()

  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1] || 'Home'
  const page = ['Home', 'Modules', 'People', 'Assignments'].includes(last)
    ? last
    : segments[segments.length - 2] === 'Assignments'
      ? 'Assignment'
      : last

  return (
    <div id="wd-courses" className="px-3">
      <div className="d-flex align-items-center py-2 border-bottom mb-3">
        <AiOutlineMenu className="fs-4 text-danger me-3" />

        <span className="fw-bold fs-5 text-danger me-2">{cid}</span>

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
          </Routes>
        </div>
      </div>
    </div>
  )
}
