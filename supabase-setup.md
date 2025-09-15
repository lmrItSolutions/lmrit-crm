# Supabase Setup Guide for CRM

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose organization
5. Enter project details:
   - Name: `crm-system`
   - Database Password: `[Generate strong password]`
   - Region: Choose closest to your users
6. Click "Create new project"

## Step 2: Setup Database

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to create all tables and policies

## Step 3: Get API Keys

1. Go to Settings > API
2. Copy these values:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 4: Configure Authentication

1. Go to Authentication > Settings
2. Configure:
   - Site URL: `http://localhost:5173` (for development)
   - Redirect URLs: Add your production domain
   - Enable email confirmations: Yes
   - Enable phone confirmations: No (unless needed)

## Step 5: Setup Storage (Optional)

1. Go to Storage
2. Create bucket: `crm-documents`
3. Set public: No
4. Create bucket: `crm-avatars`
5. Set public: Yes

## Step 6: Environment Variables

Create `.env.local` in your frontend:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 7: Test Connection

Run the test script to verify everything works:
```bash
npm run test:supabase
```
