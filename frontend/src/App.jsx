import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import ApplyLeave from './pages/ApplyLeave'
import MyLeaves from './pages/MyLeaves'
import LeaveDetail from './pages/LeaveDetail'
import LeaveTypes from './pages/LeaveTypes'
import AddLeaveType from './pages/AddLeaveType'
import EditLeaveType from './pages/EditLeaveType'
import AdminRequests from './pages/AdminRequests'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const navigate = useNavigate()

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  let homePath = "/login"
  if (user) {
    homePath = user.role === "admin" ? "/admin/dashboard" : "/my-leaves"
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to={homePath} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          <Route path="/apply-leave" element={<ProtectedRoute user={user} role="employee"><ApplyLeave /></ProtectedRoute>} />
          <Route path="/my-leaves" element={<ProtectedRoute user={user} role="employee"><MyLeaves user={user} /></ProtectedRoute>} />
          <Route path="/my-leaves/:id" element={<ProtectedRoute user={user}><LeaveDetail user={user} /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute user={user} role="admin"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute user={user} role="admin"><AdminRequests /></ProtectedRoute>} />
          <Route path="/admin/leave-types" element={<ProtectedRoute user={user} role="admin"><LeaveTypes /></ProtectedRoute>} />
          <Route path="/admin/leave-types/new" element={<ProtectedRoute user={user} role="admin"><AddLeaveType /></ProtectedRoute>} />
          <Route path="/admin/leave-types/:id/edit" element={<ProtectedRoute user={user} role="admin"><EditLeaveType /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
