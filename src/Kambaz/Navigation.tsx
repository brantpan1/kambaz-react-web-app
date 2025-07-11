import { ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AiOutlineDashboard } from 'react-icons/ai'
import { IoCalendarOutline } from 'react-icons/io5'
import { LiaBookSolid, LiaCogSolid } from 'react-icons/lia'
import { FaInbox, FaRegCircleUser } from 'react-icons/fa6'

export default function KambazNavigation() {
  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 120, height: 'full' }}
      className="rounded-0 bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      <ListGroup.Item
        id="wd-neu-link"
        action
        href="https://www.northeastern.edu/"
        target="_blank"
        className="bg-black border-0 text-center"
      >
        <img src="/images/NEU.png" width="75px" />
      </ListGroup.Item>
      <br />

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Account"
        className="text-center border-0 bg-black text-white"
      >
        <FaRegCircleUser className="fs-1 text-white" />
        <br />
        Account
      </ListGroup.Item>
      <br />

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Dashboard"
        className="text-center border-0 bg-white text-danger"
      >
        <AiOutlineDashboard className="fs-1 text-danger" />
        <br />
        Dashboard
      </ListGroup.Item>
      <br />

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Dashboard"
        className="text-center border-0 bg-black text-white"
      >
        <LiaBookSolid className="fs-1 text-danger" />
        <br />
        Courses
      </ListGroup.Item>
      <br />

      <ListGroup.Item
        as={Link}
        to="#"
        className="text-center border-0 bg-black text-white"
      >
        <IoCalendarOutline className="fs-1 text-danger" />
        <br />
        Calendar
      </ListGroup.Item>
      <br />

      <ListGroup.Item
        as={Link}
        to="#"
        className="text-center border-0 bg-black text-white"
      >
        <FaInbox className="fs-1 text-danger" />
        <br />
        Inbox
      </ListGroup.Item>
      <br />

      <ListGroup.Item
        as={Link}
        to="#"
        className="text-center border-0 bg-black text-white"
      >
        <LiaCogSolid className="fs-1 text-danger" />
        <br />
        Settings
      </ListGroup.Item>
    </ListGroup>
  )
}
