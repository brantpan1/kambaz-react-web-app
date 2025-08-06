import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setCurrentUser } from './reducer'
import * as client from './client'

export default function Signup() {
  const [user, setUser] = useState<{ username?: string; password?: string }>({})
  const [passwordCheck, setPasswordCheck] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const passwordsMatch = user.password === passwordCheck

  const signup = async () => {
    if (!passwordsMatch) {
      setError('Passwords do not match')
      return
    }
    try {
      const currentUser = await client.signup(user)
      dispatch(setCurrentUser(currentUser))
      navigate('/Kambaz/Account/Profile')
    } catch (e: any) {
      setError(e.response?.data || 'Signup failed')
    }
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h1>Sign up</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Control
        value={user.username ?? ''}
        placeholder="username"
        className="mb-2"
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <Form.Control
        value={user.password ?? ''}
        type="password"
        placeholder="password"
        className="mb-2"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <Form.Control
        value={passwordCheck}
        type="password"
        placeholder="confirm password"
        className="mb-2"
        isInvalid={passwordCheck.length > 0 && !passwordsMatch}
        onChange={(e) => setPasswordCheck(e.target.value)}
      />
      <Button
        onClick={signup}
        className="w-100 mb-2"
        disabled={!user.username || !user.password || !passwordCheck}
      >
        Create account
      </Button>
      <Link to="/Kambaz/Account/Signin">Have an account? Sign in</Link>
    </div>
  )
}
