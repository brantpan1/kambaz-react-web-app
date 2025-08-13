import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { Navigate, useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { useGetMyEnrollmentsQuery } from '@features/enrollments/enrollmentsApi'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const currentUser = useSelector((s: RootState) => s.auth.currentUser)
  const { cid } = useParams<{ cid?: string }>()

  const canBypass =
    currentUser?.role === 'FACULTY' || currentUser?.role === 'ADMIN'
  const needEnrollmentCheck = !!cid && !canBypass

  const {
    data: myCourseIds = [],
    isLoading,
    isFetching,
    isUninitialized,
    isError,
  } = useGetMyEnrollmentsQuery(undefined, {
    skip: !currentUser || !needEnrollmentCheck,
  })

  if (!currentUser) {
    return <Navigate to="/Kambaz/Account/Signin" replace />
  }

  if (needEnrollmentCheck) {
    if (isLoading || isFetching || isUninitialized) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Checking...</span>
          </Spinner>
          <h4 className="text-muted mt-3">Checking your enrollment…</h4>
        </div>
      )
    }
    const enrolled = myCourseIds.includes(cid!)
    if (isError || !enrolled) {
      return <Navigate to="/Kambaz/DashBoard" replace />
    }
  }

  return <>{children}</>
}

