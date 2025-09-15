import { Bell, Search, Menu, ChevronDown, User, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "../components/ThemeToggle"
import { useState } from "react"

export default function TopNavbar({ onSidebarToggle }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  return (
    <header className="h-16 bg-[#1f2937] text-white flex items-center justify-between px-4 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <button 
          onClick={onSidebarToggle}
          className="p-2 rounded-md hover:bg-gray-700 transition lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 w-full max-w-md">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads, deals, contacts..."
            className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="p-2 rounded-full hover:bg-gray-700 transition">
          <Bell className="h-5 w-5 text-white" />
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-700 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <ChevronDown className="h-4 w-4 text-gray-300" />
          </button>
          
          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              {/* Profile Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">siddharth.the100@gmail.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Siddharth</p>
                  </div>
                </div>
              </div>
              
              {/* Profile Menu Items */}
              <div className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </header>
  )
}
