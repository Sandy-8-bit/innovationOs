import { Routes, Route, Navigate } from 'react-router-dom'

import AuthPage from './pages/auth/AuthLayout'
import './App.css'
function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<AuthPage type="login" />}
      />

      <Route
        path="/signup"
        element={<AuthPage type="signup" />}
      />

      {/* Default Route */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App