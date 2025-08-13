import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useSignupMutation } from '@features/account/authApi'

export default function Signup() {
  const [user, setUser] = useState<any>({})
  const [signup, { isLoading, error }] = useSignupMutation()
  const navigate = useNavigate()

  const onSubmit = async () => {
    try {
      await signup(user).unwrap()
      navigate('/Kambaz/Account/Profile')
    } catch {}
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h1>Sign up</h1>
      <Form.Control
        value={user.username || ''}
        placeholder="username"
        className="mb-2"
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <Form.Control
        value={user.password || ''}
        type="password"
        placeholder="password"
        className="mb-2"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      {error && <div className="text-danger mb-2">Sign up failed.</div>}
      <Button className="w-100 mb-2" disabled={isLoading} onClick={onSubmit}>
        Create account
      </Button>
      <Link to="/Kambaz/Account/Signin">Have an account? Sign in</Link>
    </div>
  )
}
