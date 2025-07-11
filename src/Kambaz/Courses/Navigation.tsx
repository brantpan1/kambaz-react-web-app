/* src/Courses/Navigation.tsx */
import { ListGroup } from 'react-bootstrap'
import { NavLink, useParams } from 'react-router-dom'

export default function CourseNavigation() {
  const { cid } = useParams()
  const base = `/Kambaz/Courses/${cid}`
  const links = [
    { to: 'Home', label: 'Home' },
    { to: 'Modules', label: 'Modules' },
    { to: 'Assignments', label: 'Assignments' },
    { to: 'People', label: 'People' },
    { to: 'Piazza', label: 'Piazza' },
  ]
  return (
    <ListGroup id="wd-courses-navigation" className="wd fs-5 rounded-0">
      {links.map((l) => (
        <ListGroup.Item
          key={l.to}
          as={NavLink}
          to={`${base}/${l.to}`}
          className="border-0"
        >
          {l.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
