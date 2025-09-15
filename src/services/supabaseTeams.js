import { db } from '../lib/supabase'

class SupabaseTeamsService {
  // Get all teams
  async getTeams() {
    try {
      const { data, error } = await db.teams()
        .select(`
          *,
          manager:users!teams_manager_id_fkey(
            id,
            first_name,
            last_name,
            email
          ),
          members:team_members(
            user:users!team_members_user_id_fkey(
              id,
              first_name,
              last_name,
              email,
              role
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get single team by ID
  async getTeamById(id) {
    try {
      const { data, error } = await db.teams()
        .select(`
          *,
          manager:users!teams_manager_id_fkey(
            id,
            first_name,
            last_name,
            email
          ),
          members:team_members(
            user:users!team_members_user_id_fkey(
              id,
              first_name,
              last_name,
              email,
              role
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new team
  async createTeam(teamData) {
    try {
      const { data, error } = await db.teams()
        .insert(teamData)
        .select(`
          *,
          manager:users!teams_manager_id_fkey(
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

  // Update team
  async updateTeam(id, updates) {
    try {
      const { data, error } = await db.teams()
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          manager:users!teams_manager_id_fkey(
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

  // Delete team
  async deleteTeam(id) {
    try {
      const { error } = await db.teams()
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Add member to team
  async addTeamMember(teamId, userId) {
    try {
      const { data, error } = await db.teamMembers()
        .insert({
          team_id: teamId,
          user_id: userId
        })
        .select(`
          user:users!team_members_user_id_fkey(
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

  // Remove member from team
  async removeTeamMember(teamId, userId) {
    try {
      const { error } = await db.teamMembers()
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get team members
  async getTeamMembers(teamId) {
    try {
      const { data, error } = await db.teamMembers()
        .select(`
          user:users!team_members_user_id_fkey(
            id,
            first_name,
            last_name,
            email,
            role,
            is_active
          )
        `)
        .eq('team_id', teamId)

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get team statistics
  async getTeamStats(teamId) {
    try {
      // Get team members
      const membersResult = await this.getTeamMembers(teamId)
      if (!membersResult.success) {
        return membersResult
      }

      const members = membersResult.data.map(item => item.user)
      const activeMembers = members.filter(member => member.is_active)

      // Get leads assigned to team members
      const memberIds = members.map(member => member.id)
      const { data: leads, error: leadsError } = await db.leads()
        .select('status, created_at')
        .in('assigned_to', memberIds)

      if (leadsError) throw leadsError

      const stats = {
        totalMembers: members.length,
        activeMembers: activeMembers.length,
        totalLeads: leads.length,
        leadsByStatus: {
          new: leads.filter(lead => lead.status === 'New').length,
          contacted: leads.filter(lead => lead.status === 'Contacted').length,
          qualified: leads.filter(lead => lead.status === 'Qualified').length,
          lost: leads.filter(lead => lead.status === 'Lost').length,
          converted: leads.filter(lead => lead.status === 'Converted').length,
          followup: leads.filter(lead => lead.status === 'Followup').length
        },
        leadsThisMonth: leads.filter(lead => {
          const created = new Date(lead.created_at)
          const now = new Date()
          return created.getMonth() === now.getMonth() && 
                 created.getFullYear() === now.getFullYear()
        }).length
      }

      return { success: true, data: stats, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get teams for dropdown
  async getTeamsForDropdown() {
    try {
      const { data, error } = await db.teams()
        .select('id, name')
        .order('name', { ascending: true })

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Search teams
  async searchTeams(searchTerm) {
    try {
      const { data, error } = await db.teams()
        .select(`
          *,
          manager:users!teams_manager_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true })

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }
}

export default new SupabaseTeamsService()
