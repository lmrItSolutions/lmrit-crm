import { useState } from "react"
import Sidebar from "../components/Sidebar"
import TopNavbar from "../components/TopNavbar"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex flex-col flex-1">
        <TopNavbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
