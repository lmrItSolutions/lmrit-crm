# Production Setup Guide for CRM

## 1. User Management Setup

### Create Admin User
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User" and create your admin account
4. Set role to 'admin' in the users table

### Add Your Team Members
1. In Supabase Dashboard > Authentication > Users
2. Add each team member with their email
3. They'll receive invitation emails
4. Update their roles in the users table (admin, manager, agent)

## 2. Environment Variables (Production)

### Vercel Environment Variables
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add these variables for Production:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_APP_ENV`: production

### Supabase Environment Variables
1. Go to Supabase Dashboard > Settings > API
2. Copy your Project URL and anon key
3. Update Vercel with these values

## 3. Database Security

### Row Level Security (RLS)
Your RLS policies are already set up, but verify:
1. Go to Supabase Dashboard > Authentication > Policies
2. Ensure policies are enabled for all tables
3. Test with different user roles

### Data Backup
1. Go to Supabase Dashboard > Settings > Database
2. Enable automatic backups
3. Set up point-in-time recovery

## 4. Domain & SSL

### Custom Domain (Optional)
1. In Vercel Dashboard > Your Project > Settings > Domains
2. Add your custom domain (e.g., crm.yourcompany.com)
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

## 5. Monitoring & Analytics

### Vercel Analytics
1. Go to Vercel Dashboard > Your Project > Analytics
2. Enable Vercel Analytics for performance monitoring

### Supabase Monitoring
1. Go to Supabase Dashboard > Reports
2. Monitor database performance and usage

## 6. Security Hardening

### API Keys Security
1. Never commit API keys to Git
2. Use environment variables only
3. Rotate keys regularly

### User Permissions
1. Review and test all user roles
2. Ensure agents only see their assigned leads
3. Managers can see team leads
4. Admins can see everything

## 7. Data Migration (If Needed)

### Import Existing Data
1. Use Supabase Dashboard > Table Editor
2. Import CSV files for leads, users, etc.
3. Or use the API to bulk import data

## 8. Testing & Quality Assurance

### User Acceptance Testing
1. Test all features with different user roles
2. Test on different devices and browsers
3. Test data persistence and performance

### Performance Testing
1. Test with multiple concurrent users
2. Monitor database query performance
3. Optimize slow queries if needed

## 9. Documentation & Training

### User Manual
1. Create user guides for different roles
2. Document all features and workflows
3. Provide training materials

### Technical Documentation
1. Document the system architecture
2. Create troubleshooting guides
3. Document deployment procedures

## 10. Go-Live Checklist

- [ ] All users created and tested
- [ ] Environment variables configured
- [ ] RLS policies tested
- [ ] Data backup enabled
- [ ] Custom domain configured (if needed)
- [ ] Monitoring set up
- [ ] Security review completed
- [ ] User training completed
- [ ] Performance testing done
- [ ] Documentation ready

## 11. Post-Launch Monitoring

### Daily Checks
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Verify user access

### Weekly Reviews
- [ ] Review user feedback
- [ ] Check system performance
- [ ] Update documentation if needed

### Monthly Maintenance
- [ ] Update dependencies
- [ ] Review security settings
- [ ] Backup verification
- [ ] Performance optimization

## Support & Maintenance

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

### Supabase Support
- Documentation: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions

### Emergency Contacts
- Vercel Status: https://vercel-status.com
- Supabase Status: https://status.supabase.com
