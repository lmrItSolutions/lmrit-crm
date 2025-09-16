import { db, realtime } from '../lib/supabase'

class SupabaseLeadsService {
  // Get all leads with filters
  async getLeads(filters = {}) {
    try {
      let query = db.leads()
        .select(`
          *,
          assigned_to:users!leads_assigned_to_fkey(
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
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

      const { data, error } = await query

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get single lead by ID
  async getLeadById(id) {
    try {
      const { data, error } = await db.leads()
        .select(`
          *,
          assigned_to:users!leads_assigned_to_fkey(
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
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new lead
  async createLead(leadData) {
    try {
      const { data, error } = await db.leads()
        .insert(leadData)
        .select(`
          *,
          assigned_to:users!leads_assigned_to_fkey(
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

  // Update lead
  async updateLead(id, updates) {
    try {
      const { data, error } = await db.leads()
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          assigned_to:users!leads_assigned_to_fkey(
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

  // Delete lead
  async deleteLead(id) {
    try {
      const { error } = await db.leads()
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get lead activities
  async getLeadActivities(leadId) {
    try {
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

  // Get lead call logs
  async getLeadCallLogs(leadId) {
    try {
      const { data, error } = await db.callLogs()
        .select(`
          *,
          user:users!call_logs_user_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('lead_id', leadId)
        .order('call_date', { ascending: false })

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Add call log
  async addCallLog(leadId, callLogData) {
    try {
      const { data, error } = await db.callLogs()
        .insert({
          lead_id: leadId,
          ...callLogData
        })
        .select(`
          *,
          user:users!call_logs_user_id_fkey(
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

  // Get lead remarks
  async getLeadRemarks(leadId) {
    try {
      const { data, error } = await db.remarks()
        .select(`
          *,
          user:users!remarks_user_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Add remark
  async addRemark(leadId, remarkData) {
    try {
      const { data, error } = await db.remarks()
        .insert({
          lead_id: leadId,
          ...remarkData
        })
        .select(`
          *,
          user:users!remarks_user_id_fkey(
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

  // Get lead WhatsApp messages
  async getLeadWhatsAppMessages(leadId) {
    try {
      const { data, error } = await db.whatsappMessages()
        .select(`
          *,
          user:users!whatsapp_messages_user_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('lead_id', leadId)
        .order('sent_at', { ascending: false })

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Add WhatsApp message
  async addWhatsAppMessage(leadId, messageData) {
    try {
      const { data, error } = await db.whatsappMessages()
        .insert({
          lead_id: leadId,
          ...messageData
        })
        .select(`
          *,
          user:users!whatsapp_messages_user_id_fkey(
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

  // Subscribe to real-time updates
  subscribeToLeads(callback) {
    return realtime.subscribeToLeads(callback)
  }

  subscribeToActivities(leadId, callback) {
    return realtime.subscribeToActivities(leadId, callback)
  }

  subscribeToCallLogs(leadId, callback) {
    return realtime.subscribeToCallLogs(leadId, callback)
  }

  // Get lead statistics
  async getLeadStats() {
    try {
      const { data, error } = await db.leads()
        .select('status, created_at, assigned_to')

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
}

export default new SupabaseLeadsService()
