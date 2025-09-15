import { db, auth } from '../lib/supabase'

class SupabaseUsersService {
  // Get all users (with permission filtering)
  async getUsers(filters = {}) {
    try {
      let query = db.users()
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.role) {
        query = query.eq('role', filters.role)
      }
      
      if (filters.team_id) {
        query = query.eq('team_id', filters.team_id)
      }
      
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }
      
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get single user by ID
  async getUserById(id) {
    try {
      const { data, error } = await db.users()
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new user
  async createUser(userData) {
    try {
      // Create auth user first
      const { data: authData, error: authError } = await auth.signUp(
        userData.email,
        userData.password,
        {
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username
        }
      )

      if (authError) throw authError

      // Create user profile
      const { data, error } = await db.users()
        .insert({
          id: authData.user.id,
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role || 'agent',
          phone: userData.phone,
          team_id: userData.team_id,
          permissions: userData.permissions || []
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Update user
  async updateUser(id, updates) {
    try {
      const { data, error } = await db.users()
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Deactivate user (soft delete)
  async deactivateUser(id) {
    try {
      const { data, error } = await db.users()
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Reactivate user
  async reactivateUser(id) {
    try {
      const { data, error } = await db.users()
        .update({ is_active: true })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get team members
  async getTeamMembers(teamId) {
    try {
      const { data, error } = await db.users()
        .select('*')
        .eq('team_id', teamId)
        .eq('is_active', true)
        .order('first_name', { ascending: true })

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Assign user to team
  async assignToTeam(userId, teamId) {
    try {
      const { data, error } = await db.users()
        .update({ team_id: teamId })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Remove user from team
  async removeFromTeam(userId) {
    try {
      const { data, error } = await db.users()
        .update({ team_id: null })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Update user permissions
  async updatePermissions(userId, permissions) {
    try {
      const { data, error } = await db.users()
        .update({ permissions })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const { data, error } = await db.users()
        .select('role, is_active, created_at')

      if (error) throw error

      const stats = {
        total: data.length,
        active: data.filter(user => user.is_active).length,
        inactive: data.filter(user => !user.is_active).length,
        admins: data.filter(user => user.role === 'admin').length,
        managers: data.filter(user => user.role === 'manager').length,
        agents: data.filter(user => user.role === 'agent').length,
        thisMonth: data.filter(user => {
          const created = new Date(user.created_at)
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

  // Bulk create users (for importing)
  async bulkCreateUsers(usersData) {
    try {
      const results = []
      
      for (const userData of usersData) {
        const result = await this.createUser(userData)
        results.push(result)
      }

      return { success: true, data: results, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Search users
  async searchUsers(searchTerm) {
    try {
      const { data, error } = await db.users()
        .select('*')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .limit(10)

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }
}

export default new SupabaseUsersService()
