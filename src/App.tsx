import Labs from './Labs'
import Kambaz from './Kambaz'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Kambaz/store'

export default function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="Kambaz" />} />
            <Route path="/Labs/*" element={<Labs />} />
            <Route path="/Kambaz/*" element={<Kambaz />} />
          </Routes>
        </div>
      </Provider>
    </HashRouter>
  )
}
