import { ListGroup } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'

export default function CourseNavigation() {
  const { cid } = useParams()
  const { pathname } = useLocation()

  const base = `/Kambaz/Courses/${cid}`

  const links = [
    { path: `${base}/Home`, label: 'Home', exact: true },
    { path: `${base}/Modules`, label: 'Modules' },
    { path: `${base}/Assignments`, label: 'Assignments' },
    { path: `${base}/People`, label: 'People' },
    { path: `${base}/Piazza`, label: 'Piazza' },
  ]

  return (
    <ListGroup id="wd-courses-navigation" className="wd fs-5 rounded-0 pe-3">
      {links.map(({ path, label, exact }) => {
        const isActive = exact ? pathname === path : pathname.startsWith(path)
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
