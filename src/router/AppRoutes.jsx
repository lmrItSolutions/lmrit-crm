import { Routes, Route, Navigate } from "react-router-dom"
import { useSupabase } from "../context/SupabaseContext"
import Dashboard from "../pages/Dashboard"
import Leads from "../pages/LeadsSupabase"
import WhatsAppChat from "../pages/WhatsAppChat"
import CallLogs from "../pages/CallLogs"
import Remarks from "../pages/Remarks"
import Activity from "../pages/Activity"
import TeamManagement from "../pages/TeamManagement"
import Settings from "../pages/Settings"
import Login from "../pages/Login"

function ProtectedRoute({ children }) {
  const { user, loading } = useSupabase()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/leads" element={
        <ProtectedRoute>
          <Leads />
        </ProtectedRoute>
      } />
      <Route path="/whatsapp" element={
        <ProtectedRoute>
          <WhatsAppChat />
        </ProtectedRoute>
      } />
      <Route path="/calls" element={
        <ProtectedRoute>
          <CallLogs />
        </ProtectedRoute>
      } />
      <Route path="/remarks" element={
        <ProtectedRoute>
          <Remarks />
        </ProtectedRoute>
      } />
      <Route path="/activity" element={
        <ProtectedRoute>
          <Activity />
        </ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute>
          <TeamManagement />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
