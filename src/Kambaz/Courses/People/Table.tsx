import { useState, useEffect } from 'react'
import { Table, Spinner } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { findAllUsersForCourse } from './client'

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

export default function PeopleTable() {
  const { cid } = useParams<{ cid: string }>()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      if (!cid) return
      setLoading(true)
      try {
        const fetchedUsers = await findAllUsersForCourse(cid)
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('Error fetching course users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [cid])

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <h4 className="text-muted mt-3">Loading course participants...</h4>
      </div>
    )
  }

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
          {users.map((user: User) => (
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
          {users.length === 0 && (
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
