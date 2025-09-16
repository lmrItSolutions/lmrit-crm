import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Leads from "../pages/LeadsSupabase"
import WhatsAppChat from "../pages/WhatsAppChat"
import CallLogs from "../pages/CallLogs"
import Remarks from "../pages/Remarks"
import Activity from "../pages/Activity"
import TeamManagement from "../pages/TeamManagement"
import Settings from "../pages/Settings"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/whatsapp" element={<WhatsAppChat />} />
      <Route path="/calls" element={<CallLogs />} />
      <Route path="/remarks" element={<Remarks />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/team" element={<TeamManagement />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}
