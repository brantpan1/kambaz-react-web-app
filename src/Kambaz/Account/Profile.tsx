import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="mx-auto" style={{ maxWidth: 400 }}>
      <h3 className="mb-3">Profile</h3>

      <Form className="d-flex flex-column gap-3">
        <Form.Control placeholder="Username" />
        <Form.Control type="password" placeholder="Password" />
        <Form.Control placeholder="First Name" />
        <Form.Control placeholder="Last Name" />
        <Form.Control type="date" />
        <Form.Control type="email" />
        <Form.Select>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </Form.Select>

        <Link
          to="/Kambaz/Account/Signin"
          className="btn btn-danger w-100 mt-2"
          role="button"
        >
          Signout
        </Link>
      </Form>
    </div>
  )
}
