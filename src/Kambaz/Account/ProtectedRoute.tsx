import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { getCurrentUserEnrollments } from '../Courses/People/client'

export default function ProtectedRoute({ children }: { children: any }) {
  const { currentUser } = useSelector((s: any) => s.accountReducer)
  const { cid } = useParams<{ cid?: string }>()

  const [checking, setChecking] = useState<boolean>(!!cid)
  const [allowed, setAllowed] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false

    const verify = async () => {
      if (!cid) {
        setAllowed(true)
        setChecking(false)
        return
      }
      setChecking(true)
      try {
        const enrollments = await getCurrentUserEnrollments()
        if (ignore) return
        const ok = Array.isArray(enrollments) && enrollments.some((e: any) => e.course === cid)
        setAllowed(ok)
      } catch {
        if (!ignore) setAllowed(false)
      } finally {
        if (!ignore) setChecking(false)
      }
    }

    verify()
    return () => { ignore = true }
  }, [cid])

  if (!currentUser) {
    return <Navigate to="/Kambaz/Account/Signin" replace />
  }

  if (cid) {
    if (checking) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Checking...</span>
          </Spinner>
          <h4 className="text-muted mt-3">Checking your enrollment…</h4>
        </div>
      )
    }
    if (!allowed) {
      return <Navigate to="/Kambaz/Dashboard" replace />
    }
  }

  return children
}

