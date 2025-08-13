import { PropsWithChildren, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useMeQuery } from '@features/account/authApi'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Session({ children }: PropsWithChildren) {
  const { isLoading, isFetching, isUninitialized } = useMeQuery()
  const pending = isLoading || isFetching || isUninitialized

  const user = useSelector((s: RootState) => s.auth.currentUser)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (pending) return

    const base = '/Kambaz/Account'
    const atAccountRoot =
      location.pathname === base || location.pathname === `${base}/`

    if (atAccountRoot) {
      navigate(user ? `${base}/Profile` : `${base}/Signin`, { replace: true })
      return
    }

    const isAuthPage =
      location.pathname === `${base}/Signin` ||
      location.pathname === `${base}/Signup`

    if (isAuthPage && user) {
      navigate(`${base}/Profile`, { replace: true })
    }
  }, [pending, user, location.pathname, navigate])

  if (pending) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    )
  }

  return <>{children}</>
}
