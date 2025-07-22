import { ListGroup } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'

export default function CourseNavigation() {
  const { cid } = useParams()
  const { pathname } = useLocation()
  const base = `/Kambaz/Courses/${cid}`
  const links = [
    'Home',
    'Modules',
    'Piazza',
    'Zoom',
    'Assignments',
    'Quizzes',
    'Grades',
    'People',
  ]

  return (
    <ListGroup id="wd-courses-navigation" className="wd fs-5 rounded-0 pe-3">
      {links.map((label) => {
        const path = `${base}/${label}`
        const isActive =
          label === 'Home' ? pathname === path : pathname.startsWith(path)
        return (
          <ListGroup.Item
            key={path}
            as={Link}
            to={path}
            action
            active={isActive}
            className={`border-0${isActive ? '' : ' text-danger'}`}
          >
            {label}
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}
