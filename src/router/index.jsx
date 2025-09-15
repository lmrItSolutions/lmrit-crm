import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import Clients from '../pages/Clients';
import Activity from '../pages/Activity';
import CallLogs from '../pages/CallLogs';
import Remarks from '../pages/Remarks';
import Settings from '../pages/Settings';
import TeamManagement from '../pages/TeamManagement';
import WhatsAppChat from '../pages/WhatsAppChat';

export default function AppRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/call-logs" element={<CallLogs />} />
        <Route path="/remarks" element={<Remarks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/team-management" element={<TeamManagement />} />
        <Route path="/whatsapp-chat" element={<WhatsAppChat />} />
      </Routes>
    </DashboardLayout>
  );
}
