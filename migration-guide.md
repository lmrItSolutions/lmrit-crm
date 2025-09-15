# Migration Guide: MongoDB to Supabase

## Overview
This guide will help you migrate your CRM from MongoDB/Express to Supabase full-stack solution.

## Step 1: Install Dependencies

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Remove old dependencies (optional)
npm uninstall express mongoose cors dotenv bcryptjs jsonwebtoken express-validator multer helmet express-rate-limit morgan compression
```

## Step 2: Setup Supabase Project

1. Follow the instructions in `supabase-setup.md`
2. Run the SQL schema from `supabase-schema.sql`
3. Get your API keys and add them to `.env.local`

## Step 3: Update Frontend Code

### Replace Authentication
- Replace `authService.js` with `supabaseAuth.js`
- Update all auth calls to use Supabase methods

### Replace Data Services
- Replace `leadsService.js` with `supabaseLeads.js`
- Update all API calls to use Supabase client

### Update Components
- Replace API calls in components
- Add real-time subscriptions where needed
- Update error handling for Supabase responses

## Step 4: Remove Backend

1. Delete the `backend/` folder
2. Update `package.json` scripts
3. Remove backend-related dependencies

## Step 5: Update Environment Variables

Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 6: Test Migration

1. Test user authentication
2. Test CRUD operations on leads
3. Test real-time updates
4. Test file uploads (if using storage)

## Step 7: Deploy

1. Deploy frontend to Vercel/Netlify
2. Configure environment variables
3. Test production deployment

## Benefits After Migration

✅ **No Backend Server** - Supabase handles everything
✅ **Real-time Updates** - Built-in subscriptions
✅ **Authentication** - Complete user management
✅ **File Storage** - Document and image storage
✅ **Auto APIs** - REST and GraphQL APIs
✅ **Scalability** - Auto-scaling database
✅ **Security** - Row-level security policies
✅ **Monitoring** - Built-in analytics and logs

## Rollback Plan

If you need to rollback:
1. Keep your original backend code
2. Switch environment variables back
3. Revert frontend service imports
4. Restart your Express server
