import { Table, Spinner } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useGetPeopleByCourseQuery } from '@features/people/peopleApi'

export default function PeopleTable() {
  const { cid } = useParams<{ cid: string }>()
  const {
    data: users = [],
    isLoading,
    isFetching,
    isError,
  } = useGetPeopleByCourseQuery(cid!, {
    skip: !cid,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <h4 className="text-muted mt-3">Loading course participants...</h4>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-5 text-danger">
        Failed to load course participants.
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
          {users.map((user) => (
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
