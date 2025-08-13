import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useSigninMutation } from '@features/account/authApi'

export default function Signin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [signin, { isLoading, error }] = useSigninMutation()
  const navigate = useNavigate()

  const onSubmit = async () => {
    try {
      await signin(form).unwrap()
      navigate('/Kambaz/Account/Profile')
    } catch {}
  }

  return (
    <div id="wd-signin-screen" style={{ maxWidth: 400 }}>
      <h1>Sign in</h1>
      <Form.Control
        value={form.username}
        placeholder="username"
        className="mb-2"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <Form.Control
        value={form.password}
        type="password"
        placeholder="password"
        className="mb-2"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {error && <div className="text-danger mb-2">Sign in failed.</div>}
      <Button
        disabled={isLoading}
        onClick={onSubmit}
        id="wd-signin-btn"
        className="w-100 mb-2"
      >
        Sign in
      </Button>
      <Link id="wd-signup-link" to="/Kambaz/Account/Signup">
        Create account
      </Link>
    </div>
  )
}
