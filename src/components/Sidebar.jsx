import { Home, Users, Target, BarChart3, Calendar, Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const navItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Leads", path: "/leads", icon: Target },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "WhatsApp Chat", path: "/whatsapp-chat", icon: Users },
  { name: "Call Logs", path: "/call-logs", icon: BarChart3 },
  { name: "Remarks", path: "/remarks", icon: Calendar },
  { name: "Activity Logs", path: "/activity", icon: BarChart3 },
  { name: "Team Management", path: "/team-management", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen = true }) {
  const location = useLocation()
  return (
    <aside className={`${isOpen ? 'w-64' : 'w-16'} bg-[#111827] text-white h-screen flex flex-col transition-all duration-300`}>
      <div className="p-4 border-b border-gray-700">
        <h1 className={`text-xl font-bold ${!isOpen && 'hidden'}`}>CRM Dashboard</h1>
        <p className={`text-sm text-gray-400 ${!isOpen && 'hidden'}`}>Sales Management</p>
      </div>
      <nav className="p-4 flex-1">
        <p className={`text-xs text-gray-400 uppercase mb-4 ${!isOpen && 'hidden'}`}>Navigation</p>
        <ul className="space-y-2">
          {navItems.map(({ name, icon: Icon, path }) => {
            const isActive = location.pathname === path
            return (
              <li key={name}>
                <Link
                  to={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition ${isActive ? 'bg-gray-700' : ''}`}
                  title={!isOpen ? name : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {isOpen && <span>{name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
