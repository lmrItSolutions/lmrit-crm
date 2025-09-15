import { db, realtime } from '../lib/supabase'
import { PermissionService } from './permissions'

class SupabaseLeadsMultiAgentService {
  constructor(user) {
    this.user = user
    this.permissions = new PermissionService(user)
  }

  // Get leads based on user permissions
  async getLeads(filters = {}) {
    try {
      let query = db.leads()
        .select(`
          *,
          assigned_user:users!leads_assigned_to_fkey(
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })

      // Apply permission-based filters
      const permissionFilters = this.permissions.getLeadFilters()
      Object.assign(filters, permissionFilters)

      // Apply user filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      
      if (filters.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo)
      }
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
      }
      
      if (filters.company) {
        query = query.eq('company', filters.company)
      }
      
      if (filters.state) {
        query = query.eq('state', filters.state)
      }
      
      if (filters.consent) {
        query = query.eq('consent', filters.consent)
      }

      // Apply team filter if user is in a team
      if (this.user.team_id && !this.permissions.canViewAllLeads()) {
        query = query.eq('assigned_to', this.user.id)
      }

      const { data, error } = await query

      if (error) throw error

      // Filter results based on permissions
      const filteredData = data?.filter(lead => this.permissions.canAccessLead(lead)) || []

      return { success: true, data: filteredData, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get single lead by ID (with permission check)
  async getLeadById(id) {
    try {
      const { data, error } = await db.leads()
        .select(`
          *,
          assigned_user:users!leads_assigned_to_fkey(
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Check if user can access this lead
      if (!this.permissions.canAccessLead(data)) {
        return { success: false, data: null, error: 'Access denied' }
      }

      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new lead
  async createLead(leadData) {
    try {
      // Check if user can create leads
      if (!this.permissions.canCreateLeads()) {
        return { success: false, data: null, error: 'Permission denied' }
      }

      // Set assigned_to to current user if not specified
      if (!leadData.assigned_to) {
        leadData.assigned_to = this.user.id
      }

      const { data, error } = await db.leads()
        .insert(leadData)
        .select(`
          *,
          assigned_user:users!leads_assigned_to_fkey(
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Update lead (with permission check)
  async updateLead(id, updates) {
    try {
      // First check if user can access this lead
      const leadResult = await this.getLeadById(id)
      if (!leadResult.success) {
        return leadResult
      }

      // Check if user can edit this lead
      if (!this.permissions.canEditLead(leadResult.data)) {
        return { success: false, data: null, error: 'Permission denied' }
      }

      const { data, error } = await db.leads()
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          assigned_user:users!leads_assigned_to_fkey(
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Delete lead (with permission check)
  async deleteLead(id) {
    try {
      // First check if user can access this lead
      const leadResult = await this.getLeadById(id)
      if (!leadResult.success) {
        return leadResult
      }

      // Check if user can delete leads
      if (!this.permissions.canDeleteLeads()) {
        return { success: false, error: 'Permission denied' }
      }

      const { error } = await db.leads()
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get lead activities (with permission check)
  async getLeadActivities(leadId) {
    try {
      // First check if user can access this lead
      const leadResult = await this.getLeadById(leadId)
      if (!leadResult.success) {
        return leadResult
      }

      const { data, error } = await db.activities()
        .select(`
          *,
          user:users!activities_user_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('lead_id', leadId)
        .order('activity_date', { ascending: false })

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Add activity to lead
  async addActivity(leadId, activityData) {
    try {
      // First check if user can access this lead
      const leadResult = await this.getLeadById(leadId)
      if (!leadResult.success) {
        return leadResult
      }

      // Set user_id to current user
      activityData.user_id = this.user.id

      const { data, error } = await db.activities()
        .insert({
          lead_id: leadId,
          ...activityData
        })
        .select(`
          *,
          user:users!activities_user_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get team members (for managers/admins)
  async getTeamMembers() {
    try {
      if (!this.permissions.canManageUsers()) {
        return { success: false, data: null, error: 'Permission denied' }
      }

      let query = db.users()
        .select('*')
        .order('created_at', { ascending: false })

      // If user is manager, only show their team
      if (this.user.role === 'manager' && this.user.team_id) {
        query = query.eq('team_id', this.user.team_id)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get lead statistics (filtered by permissions)
  async getLeadStats() {
    try {
      const { data, error } = await this.getLeads()

      if (error) throw error

      const stats = {
        total: data.length,
        new: data.filter(lead => lead.status === 'New').length,
        contacted: data.filter(lead => lead.status === 'Contacted').length,
        qualified: data.filter(lead => lead.status === 'Qualified').length,
        lost: data.filter(lead => lead.status === 'Lost').length,
        converted: data.filter(lead => lead.status === 'Converted').length,
        followup: data.filter(lead => lead.status === 'Followup').length
      }

      return { success: true, data: stats, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Assign lead to another agent (managers/admins only)
  async assignLead(leadId, agentId) {
    try {
      if (!this.permissions.canEditAllLeads()) {
        return { success: false, data: null, error: 'Permission denied' }
      }

      const { data, error } = await db.leads()
        .update({ assigned_to: agentId })
        .eq('id', leadId)
        .select(`
          *,
          assigned_user:users!leads_assigned_to_fkey(
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Subscribe to real-time updates (filtered by permissions)
  subscribeToLeads(callback) {
    if (this.permissions.canViewAllLeads()) {
      return realtime.subscribeToLeads(callback)
    } else {
      // Only subscribe to assigned leads
      return supabase
        .channel('assigned_leads')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'leads',
            filter: `assigned_to=eq.${this.user.id}`
          }, 
          callback
        )
        .subscribe()
    }
  }
}

export default SupabaseLeadsMultiAgentService
