import { useState, useEffect } from 'react'
import { Users, UserCheck, TrendingUp, Phone, Mail, Calendar, BarChart3, Activity } from 'lucide-react'
import SupabaseLeadsMultiAgent from '../services/supabaseLeadsMultiAgent'
import supabaseUsers from '../services/supabaseUsers'
import supabaseTeams from '../services/supabaseTeams'
import { usePermissions } from '../services/permissions'

export default function DashboardMultiAgent() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [recentLeads, setRecentLeads] = useState([])
  const [teamStats, setTeamStats] = useState({})
  const [permissions, setPermissions] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabaseUsers.getUserById(user.id)
        setCurrentUser(profile)
        setPermissions(new usePermissions(profile))
      }

      // Load leads service with user context
      const leadsService = new SupabaseLeadsMultiAgent(currentUser)
      
      // Get lead statistics
      const leadsStats = await leadsService.getLeadStats()
      if (leadsStats.success) {
        setStats(leadsStats.data)
      }

      // Get recent leads
      const recentLeadsResult = await leadsService.getLeads({ limit: 5 })
      if (recentLeadsResult.success) {
        setRecentLeads(recentLeadsResult.data)
      }

      // Get team statistics if user is manager/admin
      if (permissions?.canManageUsers()) {
        const teamStatsResult = await supabaseTeams.getTeamStats(currentUser?.team_id)
        if (teamStatsResult.success) {
          setTeamStats(teamStatsResult.data)
        }
      }

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {currentUser?.first_name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your {currentUser?.role === 'agent' ? 'assigned' : ''} leads today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Leads"
          value={stats.total || 0}
          icon={Users}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="New Leads"
          value={stats.new || 0}
          icon={UserCheck}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Qualified"
          value={stats.qualified || 0}
          icon={TrendingUp}
          color="bg-purple-500"
          change={15}
        />
        <StatCard
          title="Converted"
          value={stats.converted || 0}
          icon={BarChart3}
          color="bg-orange-500"
          change={-3}
        />
      </div>

      {/* Team Stats (for managers/admins) */}
      {permissions?.canManageUsers() && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Team Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active Members</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {teamStats.activeMembers || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Leads</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {teamStats.totalLeads || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">This Month</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {teamStats.leadsThisMonth || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lead Status Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(teamStats.leadsByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {status}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Leads */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Leads
          </h3>
        </div>
        <div className="p-6">
          {recentLeads.length > 0 ? (
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{lead.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                      lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No recent leads found</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Make Calls</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Start calling leads</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Send Emails</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email your leads</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Schedule Meeting</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Book appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
