import { ListGroup } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

export default function AccountNavigation() {
  const { pathname } = useLocation()

  const links = [
    { path: '/Kambaz/Account/Signin', label: 'Signin', exact: true },
    { path: '/Kambaz/Account/Signup', label: 'Signup' },
    { path: '/Kambaz/Account/Profile', label: 'Profile' },
  ]

  return (
    <ListGroup id="wd-account-navigation" className="wd fs-5 rounded-0 pe-3">
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
