import { Routes, Route, Navigate } from 'react-router-dom'

import AuthPage from './pages/auth/AuthLayout'
import './App.css'
import ComponentShowcase from './components/ComponentShowcase'
import PopupLoaderDemo from './components/PopupLoaderDemo'
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

      <Route
        path="/test"
        element={<PopupLoaderDemo/>}
      />
    </Routes>
  )
}

export default App