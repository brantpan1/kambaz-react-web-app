import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import AccountNavigation from './navigation'
import Signin from './signin'
import Profile from './profile'
import Signup from './signup'
import ProtectedRoute from './protectedRoute'
import Session from './session'

export default function Account() {
  const currentUser = useSelector((s: RootState) => s.auth.currentUser)

  return (
    <Session>
      <div id="wd-account-screen">
        <table>
          <tbody>
            <tr>
              <td valign="top">
                <AccountNavigation />
              </td>
              <td valign="top">
                <Routes>
                  <Route
                    index
                    element={
                      <Navigate
                        to={currentUser ? 'Profile' : 'Signin'}
                        replace
                      />
                    }
                  />
                  <Route path="Signin" element={<Signin />} />
                  <Route path="Signup" element={<Signup />} />
                  <Route
                    path="Profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Session>
  )
}
