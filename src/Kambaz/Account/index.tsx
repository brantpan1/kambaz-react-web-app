import { Routes, Route, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import AccountNavigation from './Navigation'
import Signin from './Signin'
import Profile from './Profile'
import Signup from './Signup'

export default function Account() {
  const { currentUser } = useSelector((state: any) => state.accountReducer)

  return (
    <div id="wd-account-screen">
      <table>
        <tr>
          <td valign="top">
            <AccountNavigation />
          </td>
          <td valign="top">
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate
                    to={
                      currentUser
                        ? '/Kambaz/Account/Profile'
                        : '/Kambaz/Account/Signin'
                    }
                  />
                }
              />
              <Route path="/Signin" element={<Signin />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/Profile" element={<Profile />} />
            </Routes>
          </td>
        </tr>
      </table>
    </div>
  )
}
