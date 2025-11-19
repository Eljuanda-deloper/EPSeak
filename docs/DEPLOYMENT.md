# 🚀 Deployment Guide

## Overview

EPSEAK is optimized for deployment on Vercel with Supabase as the backend. This guide covers production deployment, environment setup, and monitoring.

## Prerequisites

- Vercel account
- Supabase project
- Custom domain (recommended)
- SSL certificate (provided by Vercel)

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region (recommend US East for better performance)
4. Set project name: `epseak-prod`
5. Set database password (save securely)

### 2. Database Configuration

Run the migration script to set up the database schema:

```bash
# From project root
./run-migration.sh
```

This will create all tables, RLS policies, and seed data.

### 3. Storage Setup

1. Go to Storage → Buckets in Supabase Dashboard
2. Create bucket: `avatars`
   - Public: No
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

3. Create bucket: `lesson-assets`
   - Public: Yes
   - File size limit: 50MB
   - Allowed MIME types: `image/*,audio/*,video/*`

### 4. Authentication Setup

1. Go to Authentication → Settings
2. Configure site URL: `https://yourdomain.com`
3. Configure redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/dashboard`

4. Enable email confirmations
5. Configure SMTP (optional, uses Supabase default)

### 5. API Keys

From Settings → API, copy:
- Project URL
- Project API Key (anon/public)
- Project API Key (service_role) - Keep secret!

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (automatic)

### 2. Environment Variables

Add these environment variables in Vercel dashboard:

#### Required Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

#### Optional Variables
```env
# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=true

# Monitoring
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Build Settings

In Vercel project settings:

- **Node.js Version:** 18.x or later
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
- **Output Directory:** `.next`

### 4. Domain Configuration

1. Go to Domains in Vercel dashboard
2. Add custom domain: `yourdomain.com`
3. Configure DNS records as instructed
4. Enable SSL (automatic)

### 5. Deploy

```bash
# Push to main branch to trigger deployment
git add .
git commit -m "Deploy to production"
git push origin main
```

Monitor deployment in Vercel dashboard.

## Database Migration

### Production Database Setup

1. **Backup development data** (if needed)
2. **Run migrations on production:**

```bash
# Connect to production Supabase
npx supabase db push --db-url "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

3. **Verify RLS policies are active:**

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All tables should show `rowsecurity = t`

## Performance Optimization

### Vercel Optimizations

1. **Enable Edge Functions** (automatic for API routes)
2. **Configure caching headers** (already implemented)
3. **Enable compression** (automatic)

### Database Optimizations

1. **Enable connection pooling:**
   - Go to Settings → Database → Connection Pooling
   - Note the pooled connection string

2. **Create indexes for performance:**

```sql
-- Indexes for common queries
CREATE INDEX idx_student_progress_user_lesson ON student_progress(student_id, lesson_id);
CREATE INDEX idx_modules_career_order ON modules(career_id, order_index);
CREATE INDEX idx_lessons_module_order ON lessons(module_id, order_index);
```

### CDN Configuration

1. **Vercel Edge Network** (automatic)
2. **Image optimization** (Next.js automatic)
3. **Static asset caching** (configured in next.config.mjs)

## Monitoring & Analytics

### Vercel Analytics

1. Go to Analytics in Vercel dashboard
2. Enable Real Experience Score
3. Monitor Core Web Vitals

### Error Tracking (Sentry)

1. Create project at [sentry.io](https://sentry.io)
2. Add DSN to environment variables
3. Errors will be automatically tracked

### Database Monitoring

1. **Supabase Dashboard:**
   - Query performance
   - API usage
   - Database size

2. **Custom monitoring:**
   - Response times
   - Error rates
   - User activity

## Security Checklist

### Pre-Launch Security

- [ ] RLS policies active on all tables
- [ ] Service role key not exposed in client code
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] CSRF protection configured

### Authentication Security

- [ ] Email verification required
- [ ] Password policies enforced
- [ ] Session management configured
- [ ] JWT tokens properly validated

### Data Protection

- [ ] GDPR compliance (data export/delete)
- [ ] PII data encrypted
- [ ] Backup strategy in place
- [ ] Data retention policies defined

## Backup Strategy

### Database Backups

Supabase provides automatic backups:

- **Daily backups:** Retained for 7 days
- **Weekly backups:** Retained for 4 weeks
- **Manual backups:** On-demand

### Code Backups

- **Git repository:** Primary backup
- **Vercel deployments:** Versioned deployments
- **GitHub backups:** Automated

## Rollback Strategy

### Quick Rollback

1. **Vercel Rollback:**
   - Go to Deployments
   - Click "Rollback" on previous deployment

2. **Database Rollback:**
   - Restore from backup
   - Run migrations if needed

### Emergency Procedures

1. **Scale down:** Reduce traffic
2. **Database failover:** Supabase handles automatically
3. **Cache purge:** Clear CDN cache if needed

## Testing Production

### Pre-Launch Testing

1. **Smoke tests:**
   ```bash
   # Test critical user flows
   npm run test:smoke
   ```

2. **Load testing:**
   ```bash
   # Simulate user load
   npm run test:load
   ```

3. **E2E testing:**
   ```bash
   # Full user journey tests
   npm run test:e2e
   ```

### Post-Launch Monitoring

1. **Uptime monitoring:** Use services like Pingdom or UptimeRobot
2. **Performance monitoring:** Vercel Analytics + Lighthouse CI
3. **Error monitoring:** Sentry or similar
4. **User feedback:** In-app feedback forms

## Scaling Strategy

### Vertical Scaling

- **Database:** Upgrade Supabase plan as needed
- **Compute:** Vercel scales automatically

### Horizontal Scaling

- **CDN:** Vercel Edge Network
- **Database:** Read replicas (future)
- **Caching:** Redis for session data (future)

## Cost Optimization

### Vercel Costs

- **Hobby Plan:** $0/month (perfect for MVP)
- **Pro Plan:** $20/month (recommended for production)
- **Enterprise:** Custom pricing

### Supabase Costs

- **Free Tier:** Up to 500MB database, 50MB bandwidth
- **Pro Tier:** $25/month (recommended)
- **Team Tier:** $99/month

### Optimization Tips

1. **Image optimization** reduces bandwidth costs
2. **Caching** reduces database load
3. **CDN** reduces latency and costs
4. **Lazy loading** improves performance

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel
vercel logs

# Local build test
npm run build
```

#### Database Connection Issues
```bash
# Test connection
npx supabase db ping

# Check environment variables
vercel env ls
```

#### Authentication Issues
- Verify API keys
- Check redirect URLs
- Confirm email templates

#### Performance Issues
- Check Lighthouse scores
- Monitor database queries
- Review bundle size

## Support

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Emergency Contacts

- **Vercel Support:** support@vercel.com
- **Supabase Support:** support@supabase.com
- **Development Team:** team@epseak.com

---

## Deployment Checklist

### Pre-Deployment
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] Domain configured
- [ ] SSL certificate active

### Deployment
- [ ] Code pushed to main branch
- [ ] Vercel deployment successful
- [ ] Database connection verified
- [ ] Authentication working
- [ ] All pages loading

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Performance benchmarks met
- [ ] Monitoring active
- [ ] Backup strategy confirmed
- [ ] Team notified

### Go-Live
- [ ] DNS propagated
- [ ] SSL certificate valid
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Support channels ready

---

**Version:** 1.0.0
**Last Updated:** November 2025
**Estimated Deployment Time:** 2-3 hours