// Test script to verify Supabase data
// Run this in your browser console on your Supabase project

// First, let's check if the data exists
console.log('🔍 Checking Supabase data...')

// Check users table
fetch('https://eyckmkzfisrugtdgowdr.supabase.co/rest/v1/users?select=*', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2tta3pmaXNydWd0ZGdvd2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjIyMjYsImV4cCI6MjA3MzQ5ODIyNn0.n_j-wJV_m-Trc25jz8do0BNNHKJusj3cGGOKZNzjyCQ',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2tta3pmaXNydWd0ZGdvd2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjIyMjYsImV4cCI6MjA3MzQ5ODIyNn0.n_j-wJV_m-Trc25jz8do0BNNHKJusj3cGGOKZNzjyCQ'
  }
})
.then(response => response.json())
.then(data => {
  console.log('👥 Users:', data)
})
.catch(error => {
  console.error('❌ Error fetching users:', error)
})

// Check leads table
fetch('https://eyckmkzfisrugtdgowdr.supabase.co/rest/v1/leads?select=*', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2tta3pmaXNydWd0ZGdvd2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjIyMjYsImV4cCI6MjA3MzQ5ODIyNn0.n_j-wJV_m-Trc25jz8do0BNNHKJusj3cGGOKZNzjyCQ',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2tta3pmaXNydWd0ZGdvd2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjIyMjYsImV4cCI6MjA3MzQ5ODIyNn0.n_j-wJV_m-Trc25jz8do0BNNHKJusj3cGGOKZNzjyCQ'
  }
})
.then(response => response.json())
.then(data => {
  console.log('📋 Leads:', data)
})
.catch(error => {
  console.error('❌ Error fetching leads:', error)
})
