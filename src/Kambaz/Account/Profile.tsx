import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { Button, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useSignoutMutation, useUpdateUserMutation } from '@features/account/authApi'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/services/api'
import { setCurrentUser } from '@features/account/authSlice'

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s: RootState) => s.auth.currentUser)

  const [form, setForm] = useState<Partial<User>>(user ?? {})

  const [updateUser, { isLoading: saving, isSuccess: saved }] = useUpdateUserMutation()
  const [signout, { isLoading: signingOut }] = useSignoutMutation()

  const userId = user?._id
  useEffect(() => {
    if (user) setForm(user)
  }, [userId])

  if (!user) return null

  const onSave = async () => {
    try {
      const updated = await updateUser({ userId: user._id, patch: form }).unwrap()
      dispatch(setCurrentUser(updated))
      setForm((prev) => ({ ...prev, ...updated }))
    } catch (e) {
      console.error('updateUser failed', e)
    }
  }

  const onSignout = async () => {
    try {
      await signout().unwrap()
      navigate('/Kambaz/Account/Signin', { replace: true })
    } catch {}
  }

  return (
    <div className="wd-profile-screen" style={{ maxWidth: 480 }}>
      <h1>Profile</h1>

      <Form.Control
        id="wd-username"
        className="mb-2"
        value={form.username ?? ''}
        placeholder="Username"
        onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
      />

      <Form.Control
        id="wd-password"
        className="mb-2"
        type="password"
        value={form.password ?? ''}
        placeholder="Password"
        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
      />

      <Form.Control
        id="wd-firstname"
        className="mb-2"
        value={form.firstName ?? ''}
        placeholder="First Name"
        onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
      />

      <Form.Control
        id="wd-lastname"
        className="mb-2"
        value={form.lastName ?? ''}
        placeholder="Last Name"
        onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
      />

      <Form.Control
        id="wd-dob"
        className="mb-2"
        type="date"
        value={form.dob ?? ''}
        onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))}
      />

      <Form.Control
        id="wd-email"
        className="mb-2"
        type="email"
        value={form.email ?? ''}
        placeholder="Email"
        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
      />

      <Form.Select
        id="wd-role"
        className="mb-2"
        value={(form.role as string) ?? 'USER'}
        onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as User['role'] }))}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </Form.Select>

      <div className="d-flex gap-2">
        <Button disabled={saving} onClick={onSave}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="danger" disabled={signingOut} onClick={onSignout}>
          {signingOut ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>

      {saved && <div className="mt-2 text-success">Saved!</div>}
    </div>
  )
}

