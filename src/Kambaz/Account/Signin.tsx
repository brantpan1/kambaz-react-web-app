import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Signin() {
  return (
    <div id="wd-signin-screen" style={{ maxWidth: 400 }}>
      <h1>Sign in</h1>

      <Form.Control id="wd-username" placeholder="username" className="mb-2" />
      <Form.Control
        id="wd-password"
        type="password"
        placeholder="password"
        className="mb-2"
      />

      <Link
        id="wd-signin-btn"
        to="/Kambaz/Account/Profile"
        className="btn btn-primary w-100 mb-2"
      >
        Sign in
      </Link>

      <Link id="wd-signup-link" to="/Kambaz/Account/Signup">
        Sign up
      </Link>
    </div>
  );
}

