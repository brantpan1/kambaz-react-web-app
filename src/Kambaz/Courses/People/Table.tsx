import { Table } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { people } from '../../Database'
import { useSelector } from 'react-redux'

interface User {
  _id: string
  firstName: string
  lastName: string
  loginId: string
  section: string
  role: string
  lastActivity: string
  totalActivity: string
}

interface Enrollment {
  _id: string
  user: string
  course: string
}

export default function PeopleTable() {
  const { cid } = useParams<{ cid: string }>()
  const enrollments = useSelector((state: any) => state.enrollmentsReducer)

  const enrolledUsers = people.filter((user: User) =>
    enrollments.some(
      (enrollment: Enrollment) =>
        enrollment.user === user._id && enrollment.course === cid,
    ),
  )

  return (
    <div id="wd-people-table">
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolledUsers.map((user: User) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName} </span>
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}

          {enrolledUsers.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No users enrolled in this course.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}
