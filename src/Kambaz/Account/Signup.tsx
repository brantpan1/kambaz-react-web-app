import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div style={{ maxWidth: 400 }}>
      <h1>Sign up</h1>
      <Form.Control placeholder="username" className="mb-2" />
      <Form.Control type="password" placeholder="password" className="mb-2" />
      <Form.Control type="password" placeholder="confirm password" className="mb-2" />
      <Button className="w-100 mb-2">Create account</Button>
      <Link to="/Kambaz/Account/Signin">Have an account? Sign in</Link>
    </div>
  );
}

