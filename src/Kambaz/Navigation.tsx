import { ListGroup } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineDashboard } from 'react-icons/ai'
import { IoCalendarOutline } from 'react-icons/io5'
import { LiaBookSolid, LiaCogSolid } from 'react-icons/lia'
import { FaInbox, FaRegCircleUser } from 'react-icons/fa6'

export default function KambazNavigation() {
  const { pathname } = useLocation()

  const navItems = [
    { path: '/Kambaz/Account', label: 'Account', Icon: FaRegCircleUser },
    { path: '/Kambaz/Dashboard', label: 'Dashboard', Icon: AiOutlineDashboard },
    { path: '/Kambaz/Courses', label: 'Courses', Icon: LiaBookSolid },
    { path: '/Kambaz/Calendar', label: 'Calendar', Icon: IoCalendarOutline },
    { path: '/Kambaz/Inbox', label: 'Inbox', Icon: FaInbox },
    { path: '/Labs', label: 'Labs', Icon: LiaCogSolid },
  ]

  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 120 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      <br />
      <ListGroup.Item
        id="wd-neu-link"
        action
        href="https://www.northeastern.edu/"
        target="_blank"
        className="bg-black border-0 text-center"
      >
        <img src="/images/NEU.svg" width="75px" />
      </ListGroup.Item>
      <br />

      {navItems.map(({ path, label, Icon }) => {
        const isActive = pathname === path || pathname.startsWith(`${path}/`)
        const classes = `text-center border-0 ${
          isActive ? 'bg-white text-danger' : 'bg-black text-white'
        }`

        return (
          <ListGroup.Item key={path} as={Link} to={path} className={classes}>
            <Icon className="fs-1 text-danger" />
            <br />
            {label}
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}
