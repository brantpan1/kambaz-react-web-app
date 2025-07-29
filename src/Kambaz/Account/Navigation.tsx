import { ListGroup } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer)
  const links = currentUser ? ['Profile'] : ['Signin', 'Signup']
  const { pathname } = useLocation()

  return (
    <ListGroup id="wd-account-navigation" className="wd fs-5 rounded-0 pe-3">
      {links.map((label) => {
        const path = `/Kambaz/Account/${label}`
        const isActive = pathname === path

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
