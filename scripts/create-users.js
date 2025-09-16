// Script to create users in Supabase for production
// Run this with: node scripts/create-users.js

const { createClient } = require('@supabase/supabase-js')

// Replace with your Supabase credentials
const supabaseUrl = 'https://eyckmkzfisrugtdgowdr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2tta3pmaXNydWd0ZGdvd2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjIyMjYsImV4cCI6MjA3MzQ5ODIyNn0.n_j-wJV_m-Trc25jz8do0BNNHKJusj3cGGOKZNzjyCQ'

const supabase = createClient(supabaseUrl, supabaseKey)

// Define your team members
const teamMembers = [
  {
    email: 'admin@yourcompany.com',
    password: 'SecurePassword123!',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin'
  },
  {
    email: 'manager1@yourcompany.com',
    password: 'ManagerPass123!',
    first_name: 'John',
    last_name: 'Manager',
    role: 'manager'
  },
  {
    email: 'agent1@yourcompany.com',
    password: 'AgentPass123!',
    first_name: 'Jane',
    last_name: 'Agent',
    role: 'agent'
  },
  {
    email: 'agent2@yourcompany.com',
    password: 'AgentPass123!',
    first_name: 'Bob',
    last_name: 'Smith',
    role: 'agent'
  }
  // Add more team members as needed
]

async function createUsers() {
  console.log('🚀 Creating users for production...')
  
  for (const member of teamMembers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: member.email,
        password: member.password,
      })

      if (authError) {
        console.error(`❌ Error creating auth for ${member.email}:`, authError.message)
        continue
      }

      if (authData.user) {
        // Create user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: member.email,
            first_name: member.first_name,
            last_name: member.last_name,
            role: member.role,
            username: member.email.split('@')[0],
            is_active: true
          })

        if (profileError) {
          console.error(`❌ Error creating profile for ${member.email}:`, profileError.message)
        } else {
          console.log(`✅ Created user: ${member.email} (${member.role})`)
        }
      }
    } catch (error) {
      console.error(`❌ Error creating user ${member.email}:`, error.message)
    }
  }
  
  console.log('🎉 User creation completed!')
}

// Run the script
createUsers()
