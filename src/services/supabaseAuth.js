import { auth, db } from '../lib/supabase'

class SupabaseAuthService {
  // Sign up new user
  async signUp(userData) {
    try {
      const { data, error } = await auth.signUp(
        userData.email, 
        userData.password,
        {
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username,
          phone: userData.phone,
          role: userData.role || 'agent'
        }
      )

      if (error) throw error

      // Create user profile in users table
      if (data.user) {
        const { error: profileError } = await db.users().insert({
          id: data.user.id,
          username: userData.username,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          role: userData.role || 'agent'
        })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
      }

      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await auth.signIn(email, password)
      
      if (error) throw error

      // Get user profile
      const { data: profile, error: profileError } = await db.users()
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
      }

      return { 
        success: true, 
        data: { 
          user: data.user, 
          profile: profile 
        }, 
        error: null 
      }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await auth.signOut()
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await auth.getCurrentUser()
      
      if (error) throw error
      if (!user) return { success: true, data: null, error: null }

      // Get user profile
      const { data: profile, error: profileError } = await db.users()
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return { success: true, data: { user, profile: null }, error: null }
      }

      return { 
        success: true, 
        data: { user, profile }, 
        error: null 
      }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Get session
  async getSession() {
    try {
      const { data: { session }, error } = await auth.getSession()
      if (error) throw error
      return { success: true, data: session, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return auth.onAuthStateChange(callback)
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await db.users()
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }
}

export default new SupabaseAuthService()
