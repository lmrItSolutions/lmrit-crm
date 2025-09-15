import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('VITE_SUPABASE_URL is not set')
}

if (!supabaseAnonKey || supabaseAnonKey === 'placeholder-key') {
  console.warn('VITE_SUPABASE_ANON_KEY is not set')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database helper functions
export const db = {
  // Users
  users: () => supabase.from('users'),
  
  // Leads
  leads: () => supabase.from('leads'),
  
  // Activities
  activities: () => supabase.from('activities'),
  
  // Call Logs
  callLogs: () => supabase.from('call_logs'),
  
  // Remarks
  remarks: () => supabase.from('remarks'),
  
  // Teams
  teams: () => supabase.from('teams'),
  teamMembers: () => supabase.from('team_members'),
  
  // WhatsApp
  whatsappMessages: () => supabase.from('whatsapp_messages')
}

// Auth helper functions
export const auth = {
  // Sign up
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },
  
  // Sign in
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },
  
  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },
  
  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },
  
  // Get session
  getSession: () => {
    return supabase.auth.getSession()
  },
  
  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Storage helper functions
export const storage = {
  // Upload file
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  },
  
  // Get public URL
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },
  
  // Download file
  downloadFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    return { data, error }
  }
}

// Real-time subscriptions
export const realtime = {
  // Subscribe to leads changes
  subscribeToLeads: (callback) => {
    return supabase
      .channel('leads')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' }, 
        callback
      )
      .subscribe()
  },
  
  // Subscribe to activities changes
  subscribeToActivities: (leadId, callback) => {
    return supabase
      .channel('activities')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'activities',
          filter: `lead_id=eq.${leadId}`
        }, 
        callback
      )
      .subscribe()
  },
  
  // Subscribe to call logs changes
  subscribeToCallLogs: (leadId, callback) => {
    return supabase
      .channel('call_logs')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'call_logs',
          filter: `lead_id=eq.${leadId}`
        }, 
        callback
      )
      .subscribe()
  }
}

export default supabase
