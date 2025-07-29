import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: any }) {
  const { currentUser } = useSelector((s: any) => s.accountReducer)
  const enrollments = useSelector((s: any) => s.enrollmentsReducer)

  const { cid } = useParams<{ cid?: string }>()

  if (!currentUser) {
    return <Navigate to="/Kambaz/Account/Signin" replace />
  }

  if (cid) {
    const ok = enrollments.some(
      (e: any) => e.user === currentUser._id && e.course === cid,
    )
    if (!ok) {
      return <Navigate to="/Kambaz/Dashboard" replace />
    }
  }

  return children
}
